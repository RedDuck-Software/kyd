import { polygonMumbai, scrollSepolia, sepolia } from 'viem/chains';
import { AllowedChainIds } from './addresses';

export const contractAddresses = {
  [polygonMumbai.id]: '0xC3C93ED719FCD94840ca2316b33B3862b8E514e7', // Polygon
  [scrollSepolia.id]: '0xC3C93ED719FCD94840ca2316b33B3862b8E514e7', // Scroll
  [sepolia.id]: '0xbb96438c314571DaE93A17e1DcF83cE60d8d885d',
} as Record<AllowedChainIds, `0x${string}`>;
