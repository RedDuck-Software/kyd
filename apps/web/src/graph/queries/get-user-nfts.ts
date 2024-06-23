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
  query GetUserNfts($owner: String!) {
    auctionNFTs(where: { owner: $owner }) {
      id
      tokenId
      address
      owner
      transactionHash
      blockNumber
      blockTimestamp
    }
  }
`;

export const GET_NFT_URI = gql`
  query GetNftUri($address: Bytes) {
    auctionNFTCreateds(where: { address: $address }) {
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
