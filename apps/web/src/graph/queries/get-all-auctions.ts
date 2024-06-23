import { gql } from '@apollo/client';
import { getGraphClients } from '../client';

export interface Auction {
  id: string;
  address: string;
  owner: string;
  uri: string;
  transactionHash: string;
  blockNumber: string;
  blockTimestamp: string;
  chainId: number;
}

export interface GetAllAuctionsResponse {
  auctionCreateds: Auction[];
  auctionEndeds: { id: string; address: string }[];
}

export const GET_ALL_AUCTIONS = gql`
  query GetAllAuctions($first: Int) {
    auctionCreateds(first: $first) {
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

export const getAllAuctions = async () => {
  const clients = getGraphClients();
  const queries = clients.map((clientInfo) =>
    clientInfo.client
      .query({
        query: gql`
          {
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
        `,
      })
      .then((result) => ({ ...result, chainId: clientInfo.chainId }))
  );

  const auctionCreateds: Auction[] = [];
  const auctionEndeds: { id: string; address: string }[] = [];
  const results = await Promise.all(queries);

  results.flatMap((result) => {
    result.data.auctionCreateds.forEach((auction: Auction) => {
      auctionCreateds.push({ ...auction, chainId: result.chainId });
    });
    result.data.auctionEndeds.forEach((auction: Auction) => {
      auctionEndeds.push(auction);
    });
  });

  return {
    auctionCreateds,
    auctionEndeds,
  };
};
