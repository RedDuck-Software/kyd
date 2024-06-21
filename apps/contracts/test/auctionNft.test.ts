import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import { expect } from 'chai';
import { deployAuctionNft } from './helpers/auctionNftDeploy';
import { zeroAddress } from 'viem';
import { viem } from 'hardhat';

describe('Auction NFT', function () {
  describe('Deployment', () => {
    it('Should deploy Auction NFT', async () => {
      const { auctionNft, owner } = await loadFixture(deployAuctionNft);

      expect(auctionNft.address).to.not.equal(zeroAddress);
      expect(await auctionNft.read.name()).to.equal('TEST');
      expect(await auctionNft.read.symbol()).to.equal('T');
      expect((await auctionNft.read.owner()).toLowerCase()).to.equal(
        owner.account.address.toLowerCase(),
      );
    });
  });

  describe('Mint', async () => {
    it('Should fail: not an owner', async () => {
      const { auctionNft } = await loadFixture(deployAuctionNft);

      const [, user] = await viem.getWalletClients();

      const id = await auctionNft.read.id();

      await expect(
        auctionNft.write.mint([user.account.address, id], {
          account: user.account,
        }),
      ).to.be.rejected;
    });

    it('Should not fail', async () => {
      const { auctionNft, owner } = await loadFixture(deployAuctionNft);

      const id = await auctionNft.read.id();

      const [, user] = await viem.getWalletClients();

      await auctionNft.write.mint([user.account.address, id], {
        account: owner.account,
      });

      expect(await auctionNft.read.id()).to.eq(id + 1n);
      expect((await auctionNft.read.ownerOf([id])).toLowerCase()).to.eq(
        user.account.address.toLowerCase(),
      );
    });
  });

  describe('Burn', async () => {
    it('Should not burn: no balance', async () => {
      const { auctionNft, owner } = await loadFixture(deployAuctionNft);

      const id = await auctionNft.read.id();

      const [, user] = await viem.getWalletClients();

      await auctionNft.write.mint([user.account.address, id], {
        account: owner.account,
      });
    });
  });
});
