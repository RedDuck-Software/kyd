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
    it.only('Should deploy Auction', async () => {
      const { auctionFactory, owner, erc20Test } = await loadFixture(deployAuctionNft);


      const tx = await auctionFactory.write.create([
        {
          goal: parseUnits('100', 18),
          owner: owner.account.address,
          participationNftId: 0n,
          randomWinners: 5n,
          topWinners:  [],
          stables: [erc20Test.address]
        },
        {
          name: '',
          symb: '',
          uri: ''
        },
        {
          name: '',
          symb: '',
          uri: ''
        },
      ]);



    });
  });


});
