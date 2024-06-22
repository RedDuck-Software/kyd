// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Auction} from "../Auction.sol";

contract AuctionTester is Auction {
    function _disableInitializers() internal virtual override {}

    function fulfillRandomnessTest() external {
        _fulfillRandomness(
            uint256(keccak256(abi.encodePacked(msg.sender, block.timestamp))),
            0,
            ""
        );
    }

    function _round() internal view override returns (uint256) {
        return 0;
    }
}
