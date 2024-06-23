import {
  AuctionEnded as AuctionEndedEvent,
  RewardsDistributed as RewardsDistributedEvent,
  Donate as DonateEvent,
} from '../../generated/Auction/Auction';
import {
  AuctionEnded,
  RewardsDistributed,
  Donate,
} from '../../generated/schema';

export function handleAuctionEnd(event: AuctionEndedEvent): void {
  let entity = new AuctionEnded(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.address = event.address;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleRewardsDistribution(
  event: RewardsDistributedEvent,
): void {
  let entity = new RewardsDistributed(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.address = event.address;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleDonate(event: DonateEvent): void {
  let entity = new Donate(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );

  entity.from = event.params.stable;
  entity.auction = event.address;
  entity.amount = event.params.amount;
  entity.stable = event.params.user;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
