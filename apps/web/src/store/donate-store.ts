import { AllowedChainIds } from '@/constants/addresses';
import { TokenBalance } from '@/hooks/useTokenBalances';
import { maxInt256 } from 'viem';
import { create } from 'zustand';
import { allowedTokens } from '../constants/addresses';
import { polygon, scrollSepolia, sepolia } from 'viem/chains';

export interface AllowedDonateChain {
  name: string;
  image: string;
}

export const allowedChains = {
  [scrollSepolia.id]: {
    name: 'Scroll sepolia',
    image: 'https://avatars.githubusercontent.com/u/87750292?s=280&v=4',
  },
  [polygon.id]: {
    name: 'Polygon',
    image:
      'https://moralis.io/wp-content/uploads/web3wiki/116-mumbai/637adca2e1a09547acd85968_Y_44LwHNRnOEvnRExgnO1UujtZwn7zq7BCb4oxxHgpI.jpeg',
  },
  [sepolia.id]: {
    name: 'Sepolia',
    image: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=032',
  },
} as Record<AllowedChainIds, AllowedDonateChain>;

interface DonateStore {
  amount: number | null;
  setAmount: (amount: number | null) => void;
}

const useDonateStore = create<DonateStore>((set) => ({
  amount: 0,
  setAmount: (amount) => set({ amount }),
}));

export default useDonateStore;
