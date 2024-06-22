import { polygonMumbai, scrollSepolia } from 'viem/chains';

export const contractAddresses = {
  [polygonMumbai.id]: '0xC3C93ED719FCD94840ca2316b33B3862b8E514e7', // Polygon
  [scrollSepolia.id]: '0xC3C93ED719FCD94840ca2316b33B3862b8E514e7', // Scroll
} as Record<AllowedChainIds, `0x${string}`>;

export interface Token {
  symbol: string;
  address: string | null;
  image: string;
  decimals: number;
}

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
    },
  ],
} as Record<AllowedChainIds, Token[]>;

export type AllowedChainIds = (typeof polygonMumbai)['id'] | (typeof scrollSepolia)['id'];