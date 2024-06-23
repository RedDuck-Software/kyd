import { gql } from '@apollo/client';

export interface AuctionCreated {
  id: string;
  tokenId: string;
  address: string;
  owner: string;
  transactionHash: string;
  blockNumber: string;
  blockTimestamp: string;
}

export interface Donate {
  from: string;
  auction: string;
  amount: string;
  blockNumber: string;
  blockTimestamp: string;
  id: string;
  stable: string;
  transactionHash: string;
}

export interface GetUserDonatesResponse {
  donates: Donate[];
}

export interface GetAuctionCreatedResponse {
  auctionCreateds: AuctionCreated[];
}

export const GET_USER_DONATES = gql`
  query GetUserDonates {
    donates(where: { from: Bytes }) {
      from
      auction
      amount
      blockNumber
      blockTimestamp
      id
      stable
      transactionHash
    }
  }
`;

export const GET_AUCTION_CREATED = gql`
  query GetAuctionCreated {
    auctionCreateds(where: { address: Bytes }) {
      id
      address
      uri
      owner
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;
