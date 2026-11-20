// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {FareSplitterFactory} from "../src/FareSplitter.sol";

// forge script script/Deploy.s.sol --rpc-url <rpc> --broadcast
// (SETTLER_PRIVATE_KEY in env pays deployment gas)
contract Deploy is Script {
    function run() external {
        vm.startBroadcast(vm.envUint("SETTLER_PRIVATE_KEY"));
        FareSplitterFactory factory = new FareSplitterFactory();
        console.log("FareSplitterFactory:", address(factory));
        vm.stopBroadcast();
    }
}
