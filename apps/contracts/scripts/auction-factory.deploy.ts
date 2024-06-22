import * as hre from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { delayMinutes, verify } from '@/utils/utils';
import { deploymentConstants } from '@/test/common/constants';
import { NETWORK } from '@/types/constant.types';
import { artifacts } from 'hardhat';

// TODO: change on every deploy
const auctionImpl = '0x92Ce2D7781db1d1f59eDCf89aD3C91d7058E14dA';
const auctionNFTImpl = '0xAC2053365d271B9A1D13d7B3feE5b92AB03F16f3';
const auctionNFT1155Impl = '0x642b70EFF0b0419EBA5A10e026E9297Bc234638e';
const factory = '0x7F85359FF8149b51d2A7f1CCE682B0CD0A178e55'

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
