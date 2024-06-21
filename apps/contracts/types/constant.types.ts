import { AddressLike } from 'ethers';

export enum NETWORK {
  MAINNET = 'mainnet',
  SEPOLIA = 'sepolia',
  SCROLL_SEPOLIA = 'scroll-sepolia',
}

export type DeploymentConstans = {
  ethUsdPriceFeed: AddressLike;
};
