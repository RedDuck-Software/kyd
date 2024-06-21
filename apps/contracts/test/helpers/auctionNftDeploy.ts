import AuctionModule from '@/ignition/modules/auction';
import AuctionFactoryModule from '@/ignition/modules/auctionFactory';
import AuctionNFTModule from '@/ignition/modules/auctionNft';
import AuctionNFT1155Module from '@/ignition/modules/auctionNft1155';
import ERC20TestModule from '@/ignition/modules/testERC20';
import { ignition, viem } from 'hardhat';

export async function deployAuctionNft() {
  const [owner, mockedGelatoOperator, donator] = await viem.getWalletClients();

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

  const { auctionFactory } = await ignition.deploy(AuctionFactoryModule, {
    defaultSender: owner.account.address,
    parameters: {
      'AuctionFactory' : {
        gelatoOperator: mockedGelatoOperator.account.address
      }
    }
  });

  await auctionNft.write.initialize(['TEST', 'T']);

  return {
    gelatoOperator: mockedGelatoOperator,
    auctionNft,
    auctionNft1155,
    owner,
    auction,
    auctionFactory,
    donator,
    erc20Test
  };
}
