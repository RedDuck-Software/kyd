import { zeroAddress } from 'viem';
import { polygonMumbai, scrollSepolia, sepolia } from 'viem/chains';

type Addresses = {
  auctionFactory: `0x${string}`;
  uniswapV3Router: `0x${string}`;
};

export type Token = {
  symbol: string;
  address: string | null;
  image: string;
  decimals: number;
  ethToStablePath?: string;
};

export const addresses: Record<string, Addresses> = {
  [scrollSepolia.id]: {
    auctionFactory: zeroAddress,
    uniswapV3Router: zeroAddress,
  },
  [polygonMumbai.id]: {
    auctionFactory: zeroAddress,
    uniswapV3Router: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
  },
  [sepolia.id]: {
    auctionFactory: '0xA72B8415dC96fF1D42e7e26001B0A9617B5e5Dcf',
    uniswapV3Router: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
  },
};

export const allowedTokens = {
  [scrollSepolia.id]: [
    {
      symbol: 'ETH',
      address: null,
      decimals: 18,
      image: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=032',
    },
    {
      symbol: 'USDT',
      address: '0x551197e6350936976DfFB66B2c3bb15DDB723250',
      decimals: 18,
      image: 'https://cryptologos.cc/logos/tether-usdt-logo.svg?v=032',
      ethToStablePath:
        '0x000000000000000000000000fff9976782d46cc05630d1f6ebab18b2324d6b1400000000000000000000000000000000000000000000000000000000000001f40000000000000000000000003637925ee8b837f85c7309e4b291ca56a40457a4',
    },
  ],
  // SCROLL IS CORRECT, NATIVE FIRST PLEASE
  [polygonMumbai.id]: [
    {
      symbol: 'ETH',
      address: null,
      decimals: 18,
      image: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=032',
    },
    {
      symbol: 'USDT',
      address: '0x551197e6350936976DfFB66B2c3bb15DDB723250',
      decimals: 18,
      image: 'https://cryptologos.cc/logos/tether-usdt-logo.svg?v=032',
      ethToStablePath:
        '0x000000000000000000000000fff9976782d46cc05630d1f6ebab18b2324d6b1400000000000000000000000000000000000000000000000000000000000001f40000000000000000000000003637925ee8b837f85c7309e4b291ca56a40457a4',
    },
  ],
  [sepolia.id]: [
    {
      symbol: 'ETH',
      address: null,
      decimals: 18,
      image: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=032',
    },
    {
      symbol: 'USDT',
      address: '0x3637925eE8B837f85c7309e4b291Ca56A40457a4',
      decimals: 18,
      image: 'https://cryptologos.cc/logos/tether-usdt-logo.svg?v=032',
      ethToStablePath:
        '0x000000000000000000000000fff9976782d46cc05630d1f6ebab18b2324d6b1400000000000000000000000000000000000000000000000000000000000001f40000000000000000000000003637925ee8b837f85c7309e4b291ca56a40457a4',
    },
  ],
} as Record<AllowedChainIds, Token[]>;

export type AllowedChainIds = (typeof polygonMumbai)['id'] | (typeof scrollSepolia)['id'];
