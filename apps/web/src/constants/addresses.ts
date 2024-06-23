import { zeroAddress } from 'viem';
import { polygon, polygonMumbai, scrollSepolia, sepolia } from 'viem/chains';

type Addresses = {
  auctionFactory: `0x${string}`;
  uniswapV3Router: `0x${string}`;
  swapPath: `0x${string}`;
  uniQuoter: `0x${string}`;
};

export type Token = {
  symbol: string;
  address: `0x${string}` | null;
  image: string;
  decimals: number;
  ethToStablePath?: `0x${string}`;
};

export const addresses: Record<string, Addresses> = {
  [scrollSepolia.id]: {
    auctionFactory: '0xdbCAccB6F2319f5Dba667f088bB67E71C62A5155',
    uniswapV3Router: zeroAddress,
    swapPath: zeroAddress,
    uniQuoter: zeroAddress,
  },
  [polygonMumbai.id]: {
    auctionFactory: zeroAddress,
    uniswapV3Router: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
    swapPath: '0xfff9976782d46cc05630d1f6ebab18b2324d6b140001f43637925ee8b837f85c7309e4b291ca56a40457a4',
    uniQuoter: zeroAddress,
  },
  [sepolia.id]: {
    auctionFactory: '0x60192A9Ab822745564C1C74074002141E2919ae4',
    uniswapV3Router: '0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E',
    swapPath: '0xfff9976782d46cc05630d1f6ebab18b2324d6b140001f43637925ee8b837f85c7309e4b291ca56a40457a4',
    uniQuoter: '0xEd1f6473345F45b75F8179591dd5bA1888cf2FB3',
  },
  [polygon.id]: {
    swapPath: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f0001f40d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    uniQuoter: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
    uniswapV3Router: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
    auctionFactory: '0x109663438Ff20c8391E6431F3455bD5179e50E20',
  },
};

export const allowedTokens = {
  [scrollSepolia.id]: [
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
      ethToStablePath: '0xfff9976782d46cc05630d1f6ebab18b2324d6b140001f43637925ee8b837f85c7309e4b291ca56a40457a4',
    },
  ],
  [polygon.id]: [
    {
      symbol: 'MATIC',
      address: null,
      decimals: 18,
      image:
        'https://www.google.com/url?sa=i&url=https%3A%2F%2Fseeklogo.com%2Fvector-logo%2F444501%2Fpolygon-matic&psig=AOvVaw2Mh3UFzOIZBVXa2PvDHWwC&ust=1719197215366000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCMDAq-za8IYDFQAAAAAdAAAAABAE',
    },
    {
      symbol: 'USDT',
      address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
      decimals: 18,
      image: 'https://cryptologos.cc/logos/tether-usdt-logo.svg?v=032',
      ethToStablePath: '0xfff9976782d46cc05630d1f6ebab18b2324d6b140001f43637925ee8b837f85c7309e4b291ca56a40457a4',
    },
  ],
} as Record<AllowedChainIds, Token[]>;

export type AllowedChainIds = (typeof polygonMumbai)['id'] | (typeof scrollSepolia)['id'] | (typeof sepolia)['id'];
