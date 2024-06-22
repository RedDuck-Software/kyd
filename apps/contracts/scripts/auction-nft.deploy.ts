import * as hre from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { delayMinutes, verify } from '@/utils/utils';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const factory = await hre.ethers.getContractFactory('AuctionNFT');

  const contract = await factory.deploy();
  await contract.waitForDeployment();

  console.log('Waited.');
  console.log('Delaying 1 minute before verification...');

  await delayMinutes(1);

  console.log('AuctionNFT impl address:', await contract.getAddress());

  if (hre.network.name !== 'localhost') {
    await verify(
      hre,
      await contract.getAddress(),
      'contracts/AuctionNFT.sol:AuctionNFT',
    );
  }
  // const [deployer] = await hre.ethers.getSigners();

  // const constants = deploymentConstants(hre.network.name as NETWORK);

  // if (constants === undefined) {
  //   console.error('No parameters for deployment for such network');
  //   return;
  // }

  // console.log('Deploying AuctionNFT...');
  // const deployment = await hre.upgrades.deployProxy(
  //   await hre.ethers.getContractFactory('AuctionNFT', deployer),
  //   ['kNOWYOURDONATION', 'KYD', deployer.address],
  //   {
  //     unsafeAllow: ['constructor'],
  //   },
  // );
  // console.log('Deployed AuctionNFT:', await deployment.getAddress());

  // console.log('Waiting 5 blocks...');
  // await deployment.waitForDeployment();

  // console.log('Waited.');
  // console.log('Delaying 1 minute before verification...');

  // await delayMinutes(1);

  // await logDeployProxy(hre, 'AuctionNFT', await deployment.getAddress());
  // await tryEtherscanVerifyImplementation(hre, await deployment.getAddress());
};

func(hre).then(console.log).catch(console.error);
