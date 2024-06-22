import AuctionModule from '@/ignition/modules/auction';
import AuctionFactoryModule from '@/ignition/modules/auctionFactory';
import AuctionNFTModule from '@/ignition/modules/auctionNft';
import AuctionNFT1155Module from '@/ignition/modules/auctionNft1155';
import ERC20TestModule from '@/ignition/modules/testERC20';
import { ignition, viem } from 'hardhat';
import { parseUnits, zeroAddress } from 'viem';

export async function deployAuctionNft() {
  const [owner, mockedGelatoOperator, donator, donator1, donator2] =
    await viem.getWalletClients();

  const { auctionNft } = await ignition.deploy(AuctionNFTModule, {
    defaultSender: owner.account.address,
  });

  const { auctionNft1155 } = await ignition.deploy(AuctionNFT1155Module, {
    defaultSender: owner.account.address,
  });

  const { auction } = await ignition.deploy(AuctionModule, {
    defaultSender: owner.account.address,
  });

  const { erc20Test } = await ignition.deploy(ERC20TestModule, {
    defaultSender: donator.account.address,
  });

  await erc20Test.write.mint([
    donator1.account.address,
    parseUnits('1000000', 18),
  ]);

  await erc20Test.write.mint([
    donator2.account.address,
    parseUnits('1000000', 18),
  ]);

  const { auctionFactory } = await ignition.deploy(AuctionFactoryModule, {
    defaultSender: owner.account.address,
    parameters: {
      AuctionFactoryTester: {
        gelatoOperator: mockedGelatoOperator.account.address,
      },
    },
  });

  // await auctionNft.write.initialize(['TEST', 'T', owner.]);

  return {
    gelatoOperator: mockedGelatoOperator,
    auctionNft,
    auctionNft1155,
    owner,
    auction,
    auctionFactory,
    donator,
    donator1,
    donator2,
    stables: [erc20Test],
    createAuction: async (randomWinners = 5n, topWinners = 5n) => {
      const address = await auctionFactory.simulate.create([
        {
          goal: parseUnits('100', 18),
          owner: owner.account.address,
          randomWinners: randomWinners,
          topWinners: Array.from(Array(topWinners).keys()).map((v) =>
            BigInt(v),
          ),
          stables: [erc20Test.address],
          randomWinnerNftId: 0n,
          // FIXME
          ethToStablePath: '0x',
          // FIXME
          swapStable: erc20Test.address,
          // FIXME
          uniswapV3Router: zeroAddress,
        },
        {
          name: '',
          symb: '',
          uri: '',
        },
        {
          name: '',
          symb: '',
          uri: '',
        },
      ]);

      await auctionFactory.write.create([
        {
          goal: parseUnits('100', 18),
          owner: owner.account.address,
          randomWinners: 5n,
          topWinners: [],
          stables: [erc20Test.address],
          randomWinnerNftId: 0n,
          // FIXME
          ethToStablePath: '0x',
          // FIXME
          swapStable: erc20Test.address,
          // FIXME
          uniswapV3Router: zeroAddress,
        },
        {
          name: '',
          symb: '',
          uri: '',
        },
        {
          name: '',
          symb: '',
          uri: '',
        },
      ]);

      return viem.getContractAt(
        'contracts/Auction.sol:Auction',
        address.result,
      );
    },
  };
}
