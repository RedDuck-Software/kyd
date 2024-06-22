import { AddressLike, BytesLike } from 'ethers';
import { Address } from 'viem';

export enum NETWORK {
  MAINNET = 'mainnet',
  SEPOLIA = 'sepolia',
  LOCALHOST = 'localhost',
  SCROLL_SEPOLIA = 'scroll-sepolia',
}

export type DeploymentConstans = {
  uniswapV3Router: Address;
  ethToStablePath: BytesLike;
  swapStable: Address;
  gelatoOperator: Address;
};
