// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {AuctionFactory} from "../AuctionFactory.sol";

contract AuctionFactoryTester is AuctionFactory {
    constructor(
        address _gelatoOperator,
        address _implementation,
        address _nftImplementation,
        address _nftParticipantsImplementation
    )
        AuctionFactory(
            _gelatoOperator,
            _implementation,
            _nftImplementation,
            _nftParticipantsImplementation
        )
    {}

    function fulfillRandomnessTest(address _auction) external {
        _fulfillRandomness(
            uint256(keccak256(abi.encodePacked(msg.sender, block.timestamp))),
            0,
            abi.encode(_auction)
        );
    }

    function _round() internal view override returns (uint256) {
        return 0;
    }
}
