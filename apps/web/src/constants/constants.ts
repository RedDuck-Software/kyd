import { polygonMumbai, scrollSepolia } from 'viem/chains';
import { AllowedChainIds } from './addresses';

export const contractAddresses = {
  [polygonMumbai.id]: '0xa1d8fd53987d6803d7Ca9DEa9BDf1E990F06cf1e', // Polygon
  [scrollSepolia.id]: '0xa1d8fd53987d6803d7Ca9DEa9BDf1E990F06cf1e', // Scroll
} as Record<AllowedChainIds, `0x${string}`>;
