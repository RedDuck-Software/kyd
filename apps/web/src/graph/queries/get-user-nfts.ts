import { gql } from '@apollo/client';
import { Address } from 'viem';

export interface NFT {
  id: string;
  address: Address;
  owner: Address;
  tokenId: string;
  transactionHash: string;
  blockNumber: string;
  blockTimestamp: string;
}

export interface GetUserNftsResponse {
  auctionNFTs: NFT[];
}

export const GET_USER_NFTS = gql`
  query GetUserNfts($owner: Bytes) {
    auctionNFTs(where: { owner: $owner }) {
      id
      address
      owner
      tokenId
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;
