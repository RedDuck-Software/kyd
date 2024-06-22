import {
  AuctionDeployed as AuctionDeployedEvent,
  NFTDeployed as NFTDeployedEvent,
  NFT1155Deployed as NFT1155DeployedEvent,
} from '../../generated/AuctionFactory/AuctionFactory';
import {
  AuctionCreated,
  AuctionNFTCreated,
  AuctionNFT1155Created,
} from '../../generated/schema';
import { Auction, AuctionNFT, AuctionNFT1155 } from '../../generated/templates';

export function handleAuctionCreation(event: AuctionDeployedEvent): void {
  Auction.create(event.params.auction);

  let entity = new AuctionCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );

  entity.uri = event.params.baseUri;
  entity.owner = event.params.owner;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.address = event.params.auction;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleNftCreation(event: NFTDeployedEvent): void {
  AuctionNFT.create(event.params.nft);

  let entity = new AuctionNFTCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );

  entity.auctionAddress = event.params.auctionAddress;
  entity.uri = event.params.baseUri;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.address = event.params.nft;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleNft1155Creation(event: NFT1155DeployedEvent): void {
  AuctionNFT1155.create(event.params.nft1155);

  let entity = new AuctionNFT1155Created(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );

  entity.auctionAddress = event.params.auctionAddress;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.address = event.params.nft1155;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
