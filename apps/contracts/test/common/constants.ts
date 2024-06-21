import { DeploymentConstans, NETWORK } from '@/types/constant.types';
import { AddressLike } from 'ethers';
import { Address } from 'viem';

const ethUsdPriceFeed: Address = '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419';

export const testDeployConstants = {
  ethUsdPriceFeed,
};

export const sepoliaDeployConstants = {
  ethUsdPriceFeed: '0x694AA1769357215DE4FAC081bf1f309aDC325306',
};

export function deploymentConstants(
  network: NETWORK,
): DeploymentConstans | undefined {
  switch (network) {
    case NETWORK.SEPOLIA:
      return sepoliaDeployConstants;

    default:
      return undefined;
  }
}
