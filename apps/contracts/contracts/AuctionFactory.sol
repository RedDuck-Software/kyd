//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./interfaces/IAuction.sol";
import "./Auction.sol";

struct AuctionCreateParams {
    string nftBaseUri;
    address[] stables;
    uint256 goal;
    address owner;
    address nft;
    uint256 randomWinners;
    uint256 randomWinnerNftId;
}

contract AuctionFactory {
    address[] public auctions;

    event AuctionDeployed(address indexed auction);

    address immutable gelatoOperator;
    address immutable implementation;

    constructor(address _gelatoOperator) {
        gelatoOperator = _gelatoOperator;
    }

    function create(
        AuctionCreateParams calldata params
    ) external returns (address) {
        Auction auction = Auction(payable(Clones.clone(implementation)));

        auction.initialize(
            IAuction.AuctionParams({
                stables: params.stables,
                goal: params.goal,
                owner: params.owner,
                nft: params.nft,
                randomWinners: params.randomWinners,
                randomWinnerNftId: params.randomWinnerNftId
            })
        );

        auctions.push(address(auction));

        emit AuctionDeployed(address(auction));

        return address(auction);
    }
}
