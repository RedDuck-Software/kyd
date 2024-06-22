//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.23;

import "./Auction.sol";

contract AuctionScroll is Auction {
    error NotImplemented();

    function fulfillRandomness(uint256, bytes calldata) external override {
        revert NotImplemented();
    }

    function _requestRandomness(
        bytes memory
    ) internal override returns (uint256) {
        // as we do not have a vrf provider on scroll, we a generating pseudo-random value here
        randomness = uint256(
            keccak256(
                abi.encodePacked(
                    requestPending.length,
                    address(this),
                    block.number,
                    block.timestamp,
                    block.chainid,
                    _round()
                )
            )
        );

        requestPending.push();
    }
}
