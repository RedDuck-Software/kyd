import * as hre from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { verify } from '@/utils/utils';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const factory = await hre.ethers.getContractFactory('AuctionNFT1155');

  const contract = await factory.deploy();
  await contract.waitForDeployment();

  console.log('AuctionNFT1155 impl address:', await contract.getAddress());

  if (hre.network.name !== 'localhost') {
    await verify(hre, await contract.getAddress());
  }
};

func(hre).then(console.log).catch(console.error);
