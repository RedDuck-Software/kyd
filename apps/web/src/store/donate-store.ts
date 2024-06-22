import { AllowedChainIds } from '@/constants/addresses';
import { TokenBalance } from '@/hooks/useTokenBalances';
import { maxInt256 } from 'viem';
import { create } from 'zustand';
import { allowedTokens } from '../constants/addresses';

export interface AllowedDonateChain {
  id: AllowedChainIds;
  name: string;
  image: string;
}

export const allowedChains = [
  {
    id: 534351,
    name: 'Scroll sepolia',
    image: 'https://avatars.githubusercontent.com/u/87750292?s=280&v=4',
  },
  {
    id: 80001,
    name: 'Polygon mumbai',
    image:
      'https://moralis.io/wp-content/uploads/web3wiki/116-mumbai/637adca2e1a09547acd85968_Y_44LwHNRnOEvnRExgnO1UujtZwn7zq7BCb4oxxHgpI.jpeg',
  },
] as AllowedDonateChain[];

interface DonateStore {
  chain: AllowedDonateChain;
  setDonateChain: (chain: AllowedDonateChain) => void;
  token: TokenBalance;
  setToken: (token: TokenBalance) => void;
  amount: number | null;
  setAmount: (amount: number | null) => void;
}

const useDonateStore = create<DonateStore>((set) => ({
  chain: allowedChains[0],
  setDonateChain: (chain) => set({ chain }),
  token: { ...allowedTokens[allowedChains[0].id][0], balance: BigInt(0), allowance: maxInt256 },
  setToken: (token) => set({ token }),
  amount: 0,
  setAmount: (amount) => set({ amount }),
}));

export default useDonateStore;
