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
  auctionNfts: AuctionNft[];
}

export interface GetNftUriResponse {
  auctionNFTCreateds: AuctionNftCreated[];
}

export const GET_USER_NFTS = (owner: string) => gql`
  query GetUserNfts {
    auctionNFTs(where: { owner: "${owner}" }) {
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

export const GET_NFT_URI = (nftAddress: string) => gql`
  query GetNftUri {
    auctionNFTCreateds(where: { address: "${nftAddress}" }) {
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
