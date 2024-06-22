import {
  Burn as BurnEvent,
  TransferSingle as TransferSingleEvent,
  TransferBatch as TransferBatchEvent,
} from '../../generated/AuctionNFT1155/AuctionNFT1155';
import { AuctionNFT1155Burn, AuctionNFT1155Mint } from '../../generated/schema';

// TODO: check if working okay
const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

export function handleBurn1155(event: BurnEvent): void {
  let entity = new AuctionNFT1155Burn(
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

export function handleMint1155Single(event: TransferSingleEvent): void {
  if (event.params.from.toHexString() != ADDRESS_ZERO) {
    return;
  }

  let entity = new AuctionNFT1155Mint(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );

  entity.tokenId = event.params.id;
  entity.user = event.params.to;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleMint1155Batch(event: TransferBatchEvent): void {
  if (event.params.from.toHexString() != ADDRESS_ZERO) {
    return;
  }

  for (let i = 0; i < event.params.ids.length; i++) {
    let entity = new AuctionNFT1155Mint(
      event.transaction.hash.concatI32(event.logIndex.toI32()),
    );

    entity.tokenId = event.params.ids[i];
    entity.user = event.params.to;
    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;
    entity.transactionHash = event.transaction.hash;

    entity.save();
  }
}
