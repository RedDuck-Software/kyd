import { AuctionDeployed as AuctionDeployedEvent } from '../../generated/AuctionFactory/AuctionFactory';
import { AuctionCreated } from '../../generated/schema';
import { Auction } from '../../generated/templates';

export function handleAuctionCreation(event: AuctionDeployedEvent): void {
  Auction.create(event.params.auction);

  let entity = new AuctionCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.address = event.params.auction;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
