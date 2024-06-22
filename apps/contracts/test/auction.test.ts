import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import { expect } from 'chai';
import { deployAuctionNft } from './helpers/auctionNftDeploy';
import { parseUnits, zeroAddress } from 'viem';
import { viem } from 'hardhat';

describe('Auction', function () {
  describe('Deployment', () => {
    it('Should deploy Auction', async () => {
      const { auctionNft, auction, auctionFactory, auctionNft1155, owner } =
        await loadFixture(deployAuctionNft);
    });
  });

  describe('Factory', () => {
    it('Should deploy Auction', async () => {
      const { auctionFactory, owner, stables, createAuction } =
        await loadFixture(deployAuctionNft);
      await createAuction();
    });
  });

  describe('Auction', () => {
    it('distribute', async () => {
      const {
        auctionFactory,
        donator,
        donator1,
        donator2,
        stables,
        createAuction,
      } = await loadFixture(deployAuctionNft);
      const auction = await createAuction(1n, 2n);

      await stables[0].write.approve([auction.address, 200n], {
        account: donator.account,
      });

      await auction.write.donate([stables[0].address, 100n, 0n, 0n, false], {
        account: donator.account,
      });

      await auction.write.finish();
      await auctionFactory.write.fulfillRandomnessTest([
        auction.address
      ]);

      await auction.write.distributeRewards();
    });

    it.only('donate', async () => {
      const {
        auctionFactory,
        donator,
        donator1,
        donator2,
        stables,
        createAuction,
      } = await loadFixture(deployAuctionNft);
      const auction = await createAuction();

      await stables[0].write.approve([auction.address, 200n], {
        account: donator.account,
      });

      await stables[0].write.approve([auction.address, 300n], {
        account: donator1.account,
      });

      await stables[0].write.approve([auction.address, 200n], {
        account: donator2.account,
      });

      await auction.write.donate([stables[0].address, 100n, 0n, 0n, false], {
        account: donator.account,
      });

      console.log(await auction.read.getUser([0n]));

      await auction.write.donate([
        stables[0].address,
        100n, 0n, 0n, false
      ],{account : donator.account})

      await auction.write.donate([
        stables[0].address,
        50n, 0n, 0n, true
      ],{account : donator1.account})

      await auction.write.donate([stables[0].address, 151n, 0n, 1n, false], {
        account: donator1.account,
      });

      await auction.write.donate([
        stables[0].address,
        151n, 0n, 0n, true
      ],{account : donator2.account})

      await auction.write.finish();
      console.log(await auction.read.getNodes());
        
      await auctionFactory.write.fulfillRandomnessTest([
        auction.address
      ]);

      await auction.write.distributeRewards();
    });
  });
});
