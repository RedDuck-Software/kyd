import {
  type HardhatNetworkUserConfig,
  type NetworkUserConfig,
} from 'hardhat/types';

import {
  type Network,
  type NetworkConfigParam,
  type RpcUrl,
} from '@/config/types';
import { env } from '@/env';

const { INFURA_KEY, MNEMONIC_DEV, MNEMONIC_PROD } = env;

export const rpcUrls: NetworkConfigParam<RpcUrl> = {
  main: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
  bsc: 'https://bsc-dataseed1.defibit.io',
  tbsc: 'https://data-seed-prebsc-1-s1.bnbchain.org:8545',
  sepolia: `https://sepolia.infura.io/v3/${INFURA_KEY}`,
  hardhat: 'http://localhost:8545',
  localhost: 'http://localhost:8545',
};

export const chainIds: NetworkConfigParam<number> = {
  main: 1,
  sepolia: 11155111,
  bsc: 56,
  tbsc: 97,
  hardhat: 31337,
  localhost: 31337,
};

export const mnemonics: NetworkConfigParam<string | undefined> = {
  main: MNEMONIC_PROD,
  sepolia: MNEMONIC_DEV,
  bsc: MNEMONIC_PROD,
  tbsc: MNEMONIC_DEV,
  hardhat: MNEMONIC_DEV,
  localhost: MNEMONIC_DEV,
};

export const forkingBlocks: NetworkConfigParam<number | undefined> = {
  main: 19647878,
  bsc: 38513232,
  tbsc: undefined,
  sepolia: undefined,
  hardhat: undefined,
  localhost: undefined,
};

export const getBaseNetworkConfig = (network: Network): NetworkUserConfig => ({
  accounts: mnemonics[network] ? { mnemonic: mnemonics[network] } : undefined,
  chainId: chainIds[network],
});

export const getNetworkConfig = (network: Network): NetworkUserConfig => ({
  ...getBaseNetworkConfig(network),
  url: rpcUrls[network],
});

export const getForkNetworkConfig = (
  network: Network,
): HardhatNetworkUserConfig => ({
  ...getBaseNetworkConfig(network),
  chainId: chainIds.hardhat,
  accounts: {
    mnemonic: mnemonics[network],
  },
  forking: {
    url: rpcUrls[network],
    blockNumber: forkingBlocks[network],
    enabled: true,
  },
  initialBaseFeePerGas: 0,
});

export const getHardhatNetworkConfig = (): HardhatNetworkUserConfig => ({
  ...getBaseNetworkConfig('hardhat'),
  accounts: mnemonics.hardhat ? { mnemonic: mnemonics.hardhat } : undefined,
});
