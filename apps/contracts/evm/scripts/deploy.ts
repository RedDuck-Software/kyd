import * as hre from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import {
  delayMinutes,
  logDeployProxy,
  tryEtherscanVerifyImplementation,
} from '@/utils/utils';
import { deploymentConstants } from '@/test/common/constants';
const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const [deployer] = await hre.ethers.getSigners();

  const constants = deploymentConstants(hre.network.name);

  if (constants === undefined) {
    console.error('No parameters for deployment for such network');
    return;
  }

  console.log('Deploying TokenSale...');
  const deployment = await hre.upgrades.deployProxy(
    await hre.ethers.getContractFactory('TokenSale', deployer),
    [
      deployer.address,
      constants.ethUsdPriceFeed,
      constants.usdtUsdPriceFeed,
      constants.usdtAddress,
      constants.minUsdThreshold,
    ],
    {
      unsafeAllow: ['constructor'],
    },
  );
  console.log('Deployed TokenSale:', await deployment.getAddress());

  console.log('Waiting 5 blocks...');
  await deployment.waitForDeployment();

  console.log('Waited.');
  console.log('Delaying 1 minute before verification...');

  await delayMinutes(1);

  await logDeployProxy(hre, 'TokenSale', await deployment.getAddress());
  await tryEtherscanVerifyImplementation(hre, await deployment.getAddress());
};

func(hre).then(console.log).catch(console.error);
