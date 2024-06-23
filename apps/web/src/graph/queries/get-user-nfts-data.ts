import { gql } from '@apollo/client';
import { getGraphClients } from '../client';

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

export const getUserNftsData = async (address: string) => {
  const clients = getGraphClients();
  const queries = clients.map((clientInfo) =>
    clientInfo.client
      .query({
        query: gql`
        {
          auctionNFTs(where: { owner: "${address}" }) {
            id
            blockNumber
            address
            blockTimestamp
            owner
            tokenId
            transactionHash
          }
        }
      `,
      })
      .then((result) => ({ ...result, chainId: clientInfo.chainId }))
  );

  const results = await Promise.all(queries);

  return results.flatMap((result) =>
    result.data.auctionNFTs.map((nft: AuctionNft) => ({
      chainId: result.chainId,
      ...nft,
    }))
  );
};

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
