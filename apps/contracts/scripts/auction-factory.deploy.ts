import * as hre from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { verify } from '@/utils/utils';
import { deploymentConstants } from '@/test/common/constants';
import { NETWORK } from '@/types/constant.types';
import { artifacts } from 'hardhat';

// TODO: change on every deploy
const auctionImpl = '0xc16D0AaAFd0e97FD54A1a587bbd01f17BBfc968d';
const auctionNFTImpl = '0x6b56AA0431dbE3a0cfFa657f9bFEA2A6050B9fcD';
const auctionNFT1155Impl = '0xC9819616BaEEB3bC62cd80a41284033c9799F5Bb';

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

  console.log('AuctionFactory address:', await contract.getAddress());

  if (hre.network.name !== 'localhost') {
    await verify(hre, await contract.getAddress());
  }
};

func(hre).then(console.log).catch(console.error);
