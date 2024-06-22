import { polygonMumbai, scrollSepolia } from 'viem/chains';
import { AllowedChainIds } from './addresses';

export const contractAddresses = {
  [polygonMumbai.id]: '0xC3C93ED719FCD94840ca2316b33B3862b8E514e7', // Polygon
  [scrollSepolia.id]: '0xC3C93ED719FCD94840ca2316b33B3862b8E514e7', // Scroll
} as Record<AllowedChainIds, `0x${string}`>;
