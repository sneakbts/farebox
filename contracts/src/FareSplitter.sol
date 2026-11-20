// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20 {
    function balanceOf(address) external view returns (uint256);
    function transfer(address, uint256) external returns (bool);
}

/// @title FareSplitter
/// @notice Minimal immutable fee splitter for Farebox fares.
///         Set your farebox `--pay-to` to this contract's address; fares
///         accumulate here and anyone may call `split` to forward them:
///         `feeBps` to `feeRecipient`, the remainder to `operator`.
///         No owner, no upgrade, no pause, no custody keys.
contract FareSplitter {
    address public immutable operator;
    address public immutable feeRecipient;
    uint16 public immutable feeBps; // 100 = 1%

    event Split(address indexed token, uint256 operatorAmount, uint256 feeAmount);

    error ZeroAddress();
    error FeeTooHigh();
    error TransferFailed();
    error NothingToSplit();

    constructor(address operator_, address feeRecipient_, uint16 feeBps_) {
        if (operator_ == address(0) || feeRecipient_ == address(0)) revert ZeroAddress();
        if (feeBps_ > 1000) revert FeeTooHigh(); // hard cap 10%
        operator = operator_;
        feeRecipient = feeRecipient_;
        feeBps = feeBps_;
    }

    /// @notice Forward the full token balance: fee to feeRecipient, rest to operator.
    /// @dev Callable by anyone; funds can only ever move to the two immutable addresses.
    function split(IERC20 token) external {
        uint256 bal = token.balanceOf(address(this));
        if (bal == 0) revert NothingToSplit();
        uint256 fee = (bal * feeBps) / 10_000;
        if (fee != 0 && !token.transfer(feeRecipient, fee)) revert TransferFailed();
        if (!token.transfer(operator, bal - fee)) revert TransferFailed();
        emit Split(address(token), bal - fee, fee);
    }
}

/// @title FareSplitterFactory
/// @notice Deploys deterministic FareSplitters via CREATE2 so a farebox can
///         compute its splitter address off-chain before it exists.
contract FareSplitterFactory {
    event SplitterCreated(address indexed splitter, address indexed operator, address indexed feeRecipient, uint16 feeBps);

    function create(address operator, address feeRecipient, uint16 feeBps) external returns (address splitter) {
        bytes32 salt = keccak256(abi.encode(operator, feeRecipient, feeBps));
        address predicted = splitterAddress(operator, feeRecipient, feeBps);
        if (predicted.code.length != 0) return predicted; // idempotent
        splitter = address(new FareSplitter{salt: salt}(operator, feeRecipient, feeBps));
        emit SplitterCreated(splitter, operator, feeRecipient, feeBps);
    }

    function splitterAddress(address operator, address feeRecipient, uint16 feeBps) public view returns (address) {
        bytes32 salt = keccak256(abi.encode(operator, feeRecipient, feeBps));
        bytes32 initCodeHash = keccak256(
            abi.encodePacked(type(FareSplitter).creationCode, abi.encode(operator, feeRecipient, feeBps))
        );
        return address(uint160(uint256(keccak256(abi.encodePacked(bytes1(0xff), address(this), salt, initCodeHash)))));
    }
}
