import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import { expect } from 'chai';
import { deployAuctionNft } from './helpers/auctionNftDeploy';
import { encodePacked, zeroAddress } from 'viem';
import { viem } from 'hardhat';
import { burn, mint } from './helpers/auctionNft.helper';

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
      const { auctionNft, owner } = await loadFixture(deployAuctionNft);

      const [, user] = await viem.getWalletClients();

      const id = await auctionNft.read.id();

      await mint(auctionNft, user, user.account.address, id, {
        reverted: true,
      });
    });

    it('Should not fail', async () => {
      const { auctionNft, owner } = await loadFixture(deployAuctionNft);

      const id = await auctionNft.read.id();

      const [, user] = await viem.getWalletClients();

      await mint(auctionNft, owner, user.account.address, id);
    });
  });

  describe('Burn', async () => {
    it('Should not burn: not an owner', async () => {
      const { auctionNft, owner } = await loadFixture(deployAuctionNft);

      const id = await auctionNft.read.id();

      const [, user] = await viem.getWalletClients();

      await burn(auctionNft, user, id, {
        reverted: true,
      });
    });

    it('Should not fail', async () => {
      const { auctionNft, owner } = await loadFixture(deployAuctionNft);

      const id = await auctionNft.read.id();

      const [, user] = await viem.getWalletClients();

      await mint(auctionNft, owner, user.account.address, id);

      await burn(auctionNft, user, id);
    });

    it('Should fail: already burnt', async () => {
      const { auctionNft, owner } = await loadFixture(deployAuctionNft);

      const id = await auctionNft.read.id();

      const [, user] = await viem.getWalletClients();

      await mint(auctionNft, owner, user.account.address, id);

      await burn(auctionNft, user, id, {
        reverted: true,
      });
    });

    it('Should fail transfer: burnt', async () => {
      const { auctionNft, owner } = await loadFixture(deployAuctionNft);

      const id = await auctionNft.read.id();

      const [, user] = await viem.getWalletClients();

      await mint(auctionNft, owner, user.account.address, id);

      await burn(auctionNft, user, id);

      await expect(
        auctionNft.write.transferFrom([
          user.account.address,
          owner.account.address,
          id,
        ]),
      ).to.rejected;
    });
  });
});
