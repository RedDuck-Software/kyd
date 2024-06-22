import { Address } from 'viem';
import { getGraphClients } from '../client';
import { gql } from '@apollo/client';

export interface NFTBurn {
  from: string;
  tokenId: number;
  id: string;
}

export interface NFT {
  name: string;
  img: string;
  description: string;
}

export const getUserNfts = async (address: Address) => {
  const clients = getGraphClients();
  const queries = clients.map((client) =>
    client.query({
      query: gql`
        {
          AuctionNFTBurn(where: { from: "${address}" }){
            from
            tokenId
            id
          },
          AuctionNFT1155Burn(where: { from: "${address}" }){
            from
            tokenId
            id
          }
        }
      `,
    })
  );

  const userNfts: NFT[] = [];

  const results = await Promise.all(queries);

  results.forEach((result) => {
    (result.data.donates as Donate[]).map((donate) => {
      if (!userInfo[donate.from]) {
        userInfo[donate.from] = { totalParticipated: 1, usdDonated: donate.amount, won: 1 };
      } else {
        userInfo[donate.from].totalParticipated += 1;
        userInfo[donate.from].usdDonated += donate.amount;
        userInfo[donate.from].won += 1;
      }
    });
  });

  return Object.entries(results);
};
