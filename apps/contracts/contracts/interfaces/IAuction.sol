//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.23;

interface IAuction {
    struct AuctionParams {
        address[] stables;
        uint256[] topWinners;
        uint256 goal;
        address owner;
        address nft;
        address nftParticipate;
        address gelatoOperator;
        uint256 randomWinners;
        uint256 randomWinnerNftId;
        uint256 participationNftId;
    }
}
