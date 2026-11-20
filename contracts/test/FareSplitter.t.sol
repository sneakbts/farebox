// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {FareSplitter, FareSplitterFactory, IERC20} from "../src/FareSplitter.sol";

contract MockUSDC {
    string public constant symbol = "USDC";
    mapping(address => uint256) public balanceOf;
    bool public failTransfers;

    function mint(address to, uint256 amt) external {
        balanceOf[to] += amt;
    }

    function setFail(bool f) external {
        failTransfers = f;
    }

    function transfer(address to, uint256 amt) external returns (bool) {
        if (failTransfers) return false;
        require(balanceOf[msg.sender] >= amt, "bal");
        balanceOf[msg.sender] -= amt;
        balanceOf[to] += amt;
        return true;
    }
}

contract FareSplitterTest is Test {
    FareSplitterFactory factory;
    MockUSDC usdc;
    address operator = address(0xA11CE);
    address feeRecipient = address(0xFEE);

    function setUp() public {
        factory = new FareSplitterFactory();
        usdc = new MockUSDC();
    }

    function test_SplitsAtConfiguredBps() public {
        address splitter = factory.create(operator, feeRecipient, 300); // 3%
        usdc.mint(splitter, 1_000_000); // $1.00 (6 decimals)
        FareSplitter(splitter).split(IERC20(address(usdc)));
        assertEq(usdc.balanceOf(feeRecipient), 30_000); // $0.03
        assertEq(usdc.balanceOf(operator), 970_000); // $0.97
        assertEq(usdc.balanceOf(splitter), 0);
    }

    function test_ZeroFeeSendsEverythingToOperator() public {
        address splitter = factory.create(operator, feeRecipient, 0);
        usdc.mint(splitter, 5_000);
        FareSplitter(splitter).split(IERC20(address(usdc)));
        assertEq(usdc.balanceOf(operator), 5_000);
        assertEq(usdc.balanceOf(feeRecipient), 0);
    }

    function test_TinyAmountRoundsFeeDown() public {
        address splitter = factory.create(operator, feeRecipient, 300);
        usdc.mint(splitter, 5); // fee = 5*300/10000 = 0 (rounds down)
        FareSplitter(splitter).split(IERC20(address(usdc)));
        assertEq(usdc.balanceOf(operator), 5);
        assertEq(usdc.balanceOf(feeRecipient), 0);
    }

    function test_RevertsOnEmptyBalance() public {
        address splitter = factory.create(operator, feeRecipient, 300);
        vm.expectRevert(FareSplitter.NothingToSplit.selector);
        FareSplitter(splitter).split(IERC20(address(usdc)));
    }

    function test_RevertsOnFailedTransfer() public {
        address splitter = factory.create(operator, feeRecipient, 300);
        usdc.mint(splitter, 1_000_000);
        usdc.setFail(true);
        vm.expectRevert(FareSplitter.TransferFailed.selector);
        FareSplitter(splitter).split(IERC20(address(usdc)));
    }

    function test_FeeCapAt10Percent() public {
        vm.expectRevert(FareSplitter.FeeTooHigh.selector);
        new FareSplitter(operator, feeRecipient, 1001);
        // exactly 10% is allowed
        new FareSplitter(operator, feeRecipient, 1000);
    }

    function test_ZeroAddressReverts() public {
        vm.expectRevert(FareSplitter.ZeroAddress.selector);
        new FareSplitter(address(0), feeRecipient, 100);
        vm.expectRevert(FareSplitter.ZeroAddress.selector);
        new FareSplitter(operator, address(0), 100);
    }

    function test_FactoryPredictsAddressAndIsIdempotent() public {
        address predicted = factory.splitterAddress(operator, feeRecipient, 250);
        address created = factory.create(operator, feeRecipient, 250);
        assertEq(created, predicted);
        // second create returns the same deployment instead of reverting
        assertEq(factory.create(operator, feeRecipient, 250), predicted);
        // different params -> different address
        assertTrue(factory.splitterAddress(operator, feeRecipient, 251) != predicted);
    }

    function test_AnyoneCanCallSplit_FundsOnlyGoToFixedAddresses() public {
        address splitter = factory.create(operator, feeRecipient, 300);
        usdc.mint(splitter, 100_000);
        vm.prank(address(0xBAD));
        FareSplitter(splitter).split(IERC20(address(usdc)));
        assertEq(usdc.balanceOf(address(0xBAD)), 0);
        assertEq(usdc.balanceOf(operator) + usdc.balanceOf(feeRecipient), 100_000);
    }

    function testFuzz_SplitNeverLosesFunds(uint128 amount, uint16 bps) public {
        bps = uint16(bound(bps, 0, 1000));
        vm.assume(amount > 0);
        address splitter = factory.create(operator, feeRecipient, bps);
        usdc.mint(splitter, amount);
        FareSplitter(splitter).split(IERC20(address(usdc)));
        assertEq(usdc.balanceOf(operator) + usdc.balanceOf(feeRecipient), amount);
        assertLe(usdc.balanceOf(feeRecipient), (uint256(amount) * bps) / 10_000);
    }
}
