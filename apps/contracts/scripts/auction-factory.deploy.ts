import * as hre from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { delayMinutes, verify } from '@/utils/utils';
import { deploymentConstants } from '@/test/common/constants';
import { NETWORK } from '@/types/constant.types';
import { artifacts } from 'hardhat';

// TODO: change on every deploy
const auctionImpl = '0xA365542194Bb3ba9461cF305d7270A638CB4b784';
const auctionNFTImpl = '0x4e77a0Ef485952350A35e8A13a75dB224F9E70e0';
const auctionNFT1155Impl = '0x076A8864f502E14b06008aCD2E7f860713e69C15';
const factory = '0x4C63B4c73e27A8B5043BF0ff48DF3c9B728F01cD';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const factory = await hre.ethers.getContractFactoryFromArtifact(
    artifacts.readArtifactSync('AuctionFactory'),
  );

  const constants = deploymentConstants(hre.network.name as NETWORK);
  if (constants === undefined) {
    console.error('No parameters for deployment for such network');

    return;
  }

  if (!auctionImpl || !auctionNFTImpl || !auctionNFT1155Impl) {
    console.error('Invalid implementations');

    return;
  }

  const contract = await factory.deploy(
    constants.gelatoOperator,
    auctionImpl,
    auctionNFTImpl,
    auctionNFT1155Impl,
  );
  await contract.waitForDeployment();

  console.log('Waited.');
  console.log('Delaying 1 minute before verification...');

  await delayMinutes(1);

  console.log('AuctionFactory address:', await contract.getAddress());

  if (hre.network.name !== 'localhost') {
    await verify(
      hre,
      await contract.getAddress(),
      'contracts/AuctionFactory.sol:AuctionFactory',
      constants.gelatoOperator,
      auctionImpl,
      auctionNFTImpl,
      auctionNFT1155Impl,
    );
  }
};

func(hre).then(console.log).catch(console.error);
