import { type HardhatUserConfig } from 'hardhat/config';

import 'tsconfig-paths/register';
import '@nomicfoundation/hardhat-toolbox-viem';
import 'hardhat-contract-sizer';
import 'hardhat-docgen';
import '@openzeppelin/hardhat-upgrades';

import {
  getForkNetworkConfig,
  getHardhatNetworkConfig,
  getNetworkConfig,
} from '@/config/networks';
import { env } from '@/env';

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.24',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    main: getNetworkConfig('main'),
    sepolia: getNetworkConfig('sepolia'),
    "scroll-sepolia": getNetworkConfig('scroll-sepolia'),
    ...(env.SOLIDITY_COVERAGE
      ? {}
      : {
          hardhat: env.FORKING_NETWORK
            ? getForkNetworkConfig(env.FORKING_NETWORK)
            : getHardhatNetworkConfig(),
        }),
    localhost: getNetworkConfig('localhost'),
  },
  gasReporter: {
    enabled: true,
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
  },
  docgen: {
    path: './docs',
    clear: true,
    runOnCompile: true,
  },
  etherscan: {
    apiKey: env.ETHERSCAN_API_KEY,
    customChains: [{
        network: 'scroll-sepolia',
      chainId: 534351,
      urls: {
        apiURL: 'https://api-sepolia.scrollscan.com/api',
        browserURL: 'https://sepolia.scrollscan.com'
      }}
    ]
  },
};

export default config;
