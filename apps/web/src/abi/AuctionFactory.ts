export const AUctionFactoryAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_gelatoOperator',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_implementation',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_nftImplementation',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_nftParticipantsImplementation',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'ERC1167FailedCreateClone',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'auction',
        type: 'address',
      },
    ],
    name: 'AuctionDeployed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'nft1155',
        type: 'address',
      },
    ],
    name: 'NFT1155Deployed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'nft',
        type: 'address',
      },
    ],
    name: 'NFTDeployed',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'auctions',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address[]',
            name: 'stables',
            type: 'address[]',
          },
          {
            internalType: 'bytes',
            name: 'ethToStablePath',
            type: 'bytes',
          },
          {
            internalType: 'address',
            name: 'swapStable',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'uniswapV3Router',
            type: 'address',
          },
          {
            internalType: 'uint256[]',
            name: 'topWinners',
            type: 'uint256[]',
          },
          {
            internalType: 'uint256',
            name: 'goal',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'randomWinners',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'randomWinnerNftId',
            type: 'uint256',
          },
        ],
        internalType: 'struct AuctionCreateParams',
        name: 'params',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'symb',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'uri',
            type: 'string',
          },
        ],
        internalType: 'struct AuctionNftCreateParams',
        name: 'paramsNft',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'symb',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'uri',
            type: 'string',
          },
        ],
        internalType: 'struct AuctionNftCreateParams',
        name: 'paramsNftParticipants',
        type: 'tuple',
      },
    ],
    name: 'create',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
