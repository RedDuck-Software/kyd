import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import { expect } from 'chai';
import { deployAuctionNft } from './helpers/auctionNftDeploy';
import { parseUnits, zeroAddress } from 'viem';
import { viem } from 'hardhat';

describe('Auction', function () {
  describe('Deployment', () => {
    it('Should deploy Auction', async () => {
      const { auctionNft,auction, auctionFactory, auctionNft1155, owner } = await loadFixture(deployAuctionNft);
    });
  });

  
  describe('Factory', () => {
    it('Should deploy Auction', async () => {
      const { auctionFactory, owner, stables, createAuction } = await loadFixture(deployAuctionNft);
      await createAuction();
    });
      
  });

  describe('Auction', () => {
    it.only('donate', async () => {
      const { auctionFactory, donator, stables, createAuction,  } = await loadFixture(deployAuctionNft);
      const auction = await createAuction();


      await stables[0].write.approve([
        auction.address,
        100n
      ],{account : donator.account})

      await auction.write.donate([
        stables[0].address,
        100n, 0n, 1n, false
      ],{account : donator.account})
    });
      
  });
});
