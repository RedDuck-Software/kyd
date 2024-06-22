import * as hre from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { delayMinutes, verify } from '@/utils/utils';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const factory = await hre.ethers.getContractFactory('AuctionNFT1155');

  const contract = await factory.deploy();
  await contract.waitForDeployment();

  console.log('Waited.');
  console.log('Delaying 1 minute before verification...');

  await delayMinutes(1);

  console.log('AuctionNFT1155 impl address:', await contract.getAddress());

  if (hre.network.name !== 'localhost') {
    await verify(
      hre,
      await contract.getAddress(),
      'contracts/AuctionNFT1155.sol:AuctionNFT1155',
    );
  }
};

func(hre).then(console.log).catch(console.error);
