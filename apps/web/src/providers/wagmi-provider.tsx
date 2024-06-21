import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { arbitrum, mainnet } from 'viem/chains';
import { cookieStorage, createStorage } from 'wagmi';
import { env } from '@/env';

const projectId = env.VITE_PROJECT_ID as string;

const metadata = {
  name: 'KYD',
  description: 'KYD',
  url: 'kyd.com',
  icons: [''],
};

export const config = defaultWagmiConfig({
  chains: [mainnet, arbitrum], // required
  projectId, // required
  metadata, // required
  storage: createStorage({
    storage: cookieStorage,
  }),
  enableWalletConnect: true, // Optional - true by default
  enableInjected: true, // Optional - true by default
  enableEIP6963: true, // Optional - true by default
  enableCoinbase: true, // Optional - true by default
});

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: false,
});