//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./interfaces/IAuction.sol";
import "./Auction.sol";

struct AuctionCreateParams {
    address owner;
}

contract AuctionFactory {
    address[] public auctions;

    event AuctionDeployed { 
        address indexed auction
    }

    constructor() {}

    function create(AuctionCreateParams calldata params) external {
        Auction auction = Auction(payable(Clones.clone(implementation)));
        auction.initialize(AuctionCreateParams({owner: owner}));

        auctions.push(address(auction));

        emit AuctionDeployed(address(auction));
        
        return address(auction);
    }
}
