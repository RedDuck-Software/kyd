import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import { expect } from 'chai';
import { deployAuctionNft } from './helpers/auctionNftDeploy';
import { zeroAddress } from 'viem';

describe('Auction NFT', function () {
  describe('Deployment', () => {
    it('Should deploy Auction NFT', async () => {
      const { auctionNft } = await loadFixture(deployAuctionNft);

      expect(auctionNft.address).to.not.equal(zeroAddress);
    });
  });
});
