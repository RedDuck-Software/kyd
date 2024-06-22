import { DeploymentConstans, NETWORK } from '@/types/constant.types';
import { AddressLike } from 'ethers';
import { Address, encodePacked, zeroAddress } from 'viem';

const ethUsdPriceFeed: Address = '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419';

export const testDeployConstants = {
  ethUsdPriceFeed,
};

export const sepoliaDeployConstants: DeploymentConstans = {
  uniswapV3Router: '0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E',
  ethToStablePath: encodePacked(
    ['address', 'uint24', 'address'],
    [
      '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
      500,
      '0x3637925eE8B837f85c7309e4b291Ca56A40457a4',
    ],
  ),
  swapStable: '0x3637925eE8B837f85c7309e4b291Ca56A40457a4', // USDT
  gelatoOperator: '0x6988FbA6aA828Da9B3f13Edaf9020204C4713245',
};

export const sepoliaScrollDeployConstants: DeploymentConstans = {
  uniswapV3Router: '0xfc30937f5cDe93Df8d48aCAF7e6f5D8D8A31F636',
  ethToStablePath: encodePacked(
    ['address', 'uint24', 'address'],
    [
      '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
      500,
      '0x3637925eE8B837f85c7309e4b291Ca56A40457a4',
    ],
  ),
  swapStable: '0x551197e6350936976DfFB66B2c3bb15DDB723250', // USDT
  gelatoOperator: zeroAddress,
};

export function deploymentConstants(
  network: NETWORK,
): DeploymentConstans | undefined {
  switch (network) {
    case NETWORK.SEPOLIA:
      return sepoliaDeployConstants;

    case NETWORK.LOCALHOST:
      return sepoliaDeployConstants;
    case NETWORK.SCROLL_SEPOLIA:
      return sepoliaScrollDeployConstants;
    default:
      return undefined;
  }
}
