//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./interfaces/IAuction.sol";
import "./Auction.sol";
import "./AuctionNFT.sol";
import "./AuctionNFT1155.sol";

struct AuctionCreateParams {
    address[] stables;
    bytes ethToStablePath;
    address swapStable;
    address uniswapV3Router;
    uint256[] topWinners;
    uint256 goal;
    address owner;
    uint256 randomWinners;
    uint256 randomWinnerNftId;
    string baseUri;
}

struct AuctionNftCreateParams {
    string name;
    string symb;
    string uri;
}

contract AuctionFactory {
    address[] public auctions;

    event AuctionDeployed(
        address indexed auction,
        address indexed owner,
        string baseUri
    );
    event NFTDeployed(address indexed nft, string baseUri);
    event NFT1155Deployed(address indexed nft1155, string baseUri);

    address immutable gelatoOperator;
    address immutable implementation;
    address immutable nftImplementation;
    address immutable nftParticipantsImplementation;

    constructor(
        address _gelatoOperator,
        address _implementation,
        address _nftImplementation,
        address _nftParticipantsImplementation
    ) {
        gelatoOperator = _gelatoOperator;
        implementation = _implementation;

        nftImplementation = _nftImplementation;
        nftParticipantsImplementation = _nftParticipantsImplementation;
    }

    function create(
        AuctionCreateParams calldata params,
        AuctionNftCreateParams calldata paramsNft,
        AuctionNftCreateParams calldata paramsNftParticipants
    ) external returns (address) {
        AuctionNFT auctionNFT = AuctionNFT(
            payable(Clones.clone(nftImplementation))
        );
        AuctionNFT1155 auctionNFTParticipants = AuctionNFT1155(
            payable(Clones.clone(nftParticipantsImplementation))
        );
        Auction auction = Auction(payable(Clones.clone(implementation)));

        auctionNFT.initialize(paramsNft.name, paramsNft.symb, address(auction));
        auctionNFTParticipants.initialize(
            paramsNftParticipants.uri,
            address(auction)
        );

        auction.initialize(
            IAuction.AuctionParams({
                stables: params.stables,
                ethToStablePath: params.ethToStablePath,
                swapStable: params.swapStable,
                uniswapV3Router: params.uniswapV3Router,
                topWinners: params.topWinners,
                goal: params.goal,
                gelatoOperator: gelatoOperator,
                owner: params.owner,
                nft: address(auctionNFT),
                nftParticipate: address(auctionNFTParticipants),
                randomWinners: params.randomWinners,
                randomWinnerNftId: params.randomWinnerNftId,
                participationNftId: 0
            })
        );

        auctions.push(address(auction));

        emit AuctionDeployed(address(auction), params.owner, params.baseUri);
        emit NFTDeployed(address(auctionNFT), paramsNft.uri);
        emit NFT1155Deployed(
            address(auctionNFTParticipants),
            paramsNftParticipants.uri
        );

        return address(auction);
    }
}
