import * as hre from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { delayMinutes, verify } from '@/utils/utils';
import { deploymentConstants } from '@/test/common/constants';
import { NETWORK } from '@/types/constant.types';
import { artifacts } from 'hardhat';

// TODO: change on every deploy
const auctionImpl = '0xC3C93ED719FCD94840ca2316b33B3862b8E514e7';
const auctionNFTImpl = '0xae4915dfFC809A8BEbE12b27bf60c2fAfd1C53D9';
const auctionNFT1155Impl = '0x2D130B0B5615c455feC6E5D3c4Bfa1023e616968';

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
