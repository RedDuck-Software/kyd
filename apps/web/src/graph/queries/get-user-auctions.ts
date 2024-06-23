import { gql } from '@apollo/client';
import { getGraphClients } from '../client';
import { Address } from 'viem';

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
  auctionUri: string;
}

export interface GetUserDonatesResponse {
  donates: Donate[];
}

export interface GetAuctionCreatedResponse {
  auctionCreateds: AuctionCreated[];
}

type AuctionMetadata = {
  name: string;
  description: string;
  isAdmin: boolean;
  inProgress: boolean;
  uri: string;
};

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

export const getUserAuctions = async (address: Address) => {
  const clients = getGraphClients();
  const queries = clients.map((client) =>
    client.query({
      query: gql`
        {
          donates(where: { from: "${address}" }){
            from
            stable
            amount
            auction
            blockTimestamp
          }
        }
      `,
      variables: {
        from: address,
      },
    })
  );

  const res = await Promise.all(queries);

  for (let i in res) {
    const result = res[i];

    const auctions = await Promise.all(
      result.data.donates.map((v: Donate) =>
        clients[i].query({
          query: gql`
              {
                auctionCreateds(where: { address: ${v.auction} }) {
                  address
                  blockTimestamp
                }
              }
            `,
        })
      )
    );

    console.log({ result, auctions });
  }

  // return res.data.donates.map((d: Donate) => {
  //   const auction = auctions.data.auctionCreateds.find((v: AuctionCreated) => v.address === d.auction);

  //   console.log({ auction });
  //   return {
  //     ...d,
  //     auction: {
  //       uri: auction.uri,
  //     },
  //   };
  // });
};
