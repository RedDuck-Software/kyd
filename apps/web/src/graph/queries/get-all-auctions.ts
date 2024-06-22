import { gql } from '@apollo/client';

export interface Auction {
  id: string;
  address: string;
  owner: string;
  uri: string;
  transactionHash: string;
  blockNumber: string;
  blockTimestamp: string;
}

export interface GetAllAuctionsResponse {
  auctionCreateds: Auction[];
  auctionEndeds: { id: string; address: string }[];
}

export const GET_ALL_AUCTIONS = gql`
  query GetAllAuctions {
    auctionCreateds {
      id
      address
      owner
      uri
      transactionHash
      blockNumber
      blockTimestamp
    }
    auctionEndeds {
      id
      address
    }
  }
`;
