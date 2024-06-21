//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.23;

interface IAuction {
    struct AuctionParams {
        address[] stables;
        uint256 goal;
        address owner;
        address nft;
        uint256 randomWinners;
        uint256 randomWinnerNftId;
    }
}
