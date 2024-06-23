import { polygonMumbai, scrollSepolia, sepolia } from 'viem/chains';
import { AllowedChainIds } from './addresses';

export const contractAddresses = {
  [polygonMumbai.id]: '0xC3C93ED719FCD94840ca2316b33B3862b8E514e7', // Polygon
  [scrollSepolia.id]: '0xC3C93ED719FCD94840ca2316b33B3862b8E514e7', // Scroll
  [sepolia.id]: '0x8092f64203fDF62334B5969BFBED6e696C53ebB4',
} as Record<AllowedChainIds, `0x${string}`>;
