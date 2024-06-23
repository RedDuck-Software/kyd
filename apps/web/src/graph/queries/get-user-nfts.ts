import { gql } from '@apollo/client';

export interface AuctionNft {
  id: string;
  tokenId: string;
  address: string;
  owner: string;
  transactionHash: string;
  blockNumber: string;
  blockTimestamp: string;
}

export interface AuctionNftCreated {
  id: string;
  address: string;
  uri: string;
  auctionAddress: string;
  transactionHash: string;
  blockTimestamp: string;
  blockNumber: string;
}

export interface GetUserNftsResponse {
  auctionNFTs: AuctionNft[];
}

export interface GetNftUriResponse {
  auctionNFTCreateds: AuctionNftCreated[];
}

export const GET_USER_NFTS = gql`
  query GetUserNfts {
    auctionNFTs(where: { owner: Bytes }) {
      id
      blockNumber
      address
      blockTimestamp
      owner
      tokenId
      transactionHash
    }
  }
`;

export const GET_NFT_URI = gql`
  query GetNftUri {
    auctionNFTCreateds(where: { address: Bytes }) {
      id
      address
      uri
      auctionAddress
      transactionHash
      blockTimestamp
      blockNumber
    }
  }
`;
