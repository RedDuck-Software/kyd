import { AddressLike } from 'ethers';
import { Address, parseUnits, parseEther } from 'viem';

const ethUsdPriceFeed: Address = '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419';
const usdtUsdPriceFeed: Address = '0x3E7d1eAB13ad0104d2750B8863b489D65364e32D';
const usdtAddress: Address = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
const usdtHolderAddress: Address = '0xf977814e90da44bfa03b6295a0616a897441acec';
const usdtDecimals = 6;

const minUsdThreshold: bigint = parseUnits('500', 18);
const maxTokensToSell: bigint = parseUnits('36810375', 18);

const firstRoundPrice: bigint = parseEther('0.1');
const roundEndTime = Date.now() + 604800;

export const testDeployConstants = {
  ethUsdPriceFeed,
  usdtUsdPriceFeed,
  usdtAddress,
  usdtHolderAddress,
  usdtDecimals,
  minUsdThreshold,
  maxTokensToSell,
  firstRoundPrice,
  roundEndTime,
};

export const sepoliaDeployConstants = {
  ethUsdPriceFeed: '0x694AA1769357215DE4FAC081bf1f309aDC325306',
  usdtUsdPriceFeed: '0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E',
  usdtAddress: '0xC48B32a94804668261E8085052FF02dfF1dDC679',
  minUsdThreshold: parseEther('5'),
  maxTokensToSell: parseEther('200000000'),
};

export const mainnetDeployConstants = {
  ethUsdPriceFeed: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
  usdtUsdPriceFeed: '0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6',
  usdtAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  minUsdThreshold: parseEther('1'),
  maxTokensToSell: parseEther('200000000'),
};

export const bscDeployConstants = {
  ethUsdPriceFeed: '0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE',
  usdtUsdPriceFeed: '0x51597f405303C4377E36123cBc172b13269EA163',
  usdtAddress: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  minUsdThreshold: parseEther('1'),
  maxTokensToSell: parseEther('200000000'),
};

export const bscTestDeployConstants = {
  ethUsdPriceFeed: '0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526',
  usdtUsdPriceFeed: '0x90c069C4538adAc136E051052E14c1cD799C41B7',
  usdtAddress: '0xbceCE4ce10f852f633104679d944cEbCEe27c189',
  minUsdThreshold: parseEther('5'),
  maxTokensToSell: parseEther('200000000'),
};

interface IDeploymentConstans {
  ethUsdPriceFeed: AddressLike;
  usdtUsdPriceFeed: AddressLike;
  usdtAddress: AddressLike;
  minUsdThreshold: bigint;
  maxTokensToSell: bigint;
}

export function deploymentConstants(
  network: string,
): IDeploymentConstans | undefined {
  if (network === 'main') {
    return mainnetDeployConstants;
  } else if (network === 'bsc') {
    return bscDeployConstants;
  } else if (network === 'tbsc') {
    return bscTestDeployConstants;
  } else if (network === 'sepolia') {
    return sepoliaDeployConstants;
  } else if (network === 'hardhat') {
    return mainnetDeployConstants;
  }
  return undefined;
}
