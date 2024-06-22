import { zeroAddress } from 'viem';
import { polygonMumbai, scrollSepolia } from 'viem/chains';

type Addresses = {
  auction: `0x${string}`;
  auctionFactory: `0x${string}`;
  auctionNft: `0x${string}`;
  auctionNft1155: `0x${string}`;
};

export const addresses: Record<string, Addresses> = {
  [scrollSepolia.id]: {
    auction: zeroAddress,
    auctionFactory: zeroAddress,
    auctionNft: zeroAddress,
    auctionNft1155: zeroAddress,
  },
  [polygonMumbai.id]: {
    auction: zeroAddress,
    auctionFactory: zeroAddress,
    auctionNft: zeroAddress,
    auctionNft1155: zeroAddress,
  },
};
