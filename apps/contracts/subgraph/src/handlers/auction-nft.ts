import {
  Burn as BurnEvent,
  Transfer as TransferEvent,
} from '../../generated/AuctionNFT/AuctionNFT';
import { AuctionNFTBurn, AuctionNFT } from '../../generated/schema';

export function handleBurn(event: BurnEvent): void {
  let entity = new AuctionNFTBurn(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );

  entity.from = event.params.from;
  entity.tokenId = event.params.tokenId;
  entity.data = event.params.data;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new AuctionNFT(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );

  entity.tokenId = event.params.tokenId;
  entity.owner = event.params.to;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
