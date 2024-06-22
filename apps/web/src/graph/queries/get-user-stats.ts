import { Address } from 'viem';
import { getGraphClients } from '../client';
import { gql } from '@apollo/client';

export interface UserInfo {
  usdDonated: number;
  totalParticipated: number;
  won: number;
}

export interface Donate {
  from: string;
  stable: string;
  amount: number;
  auction: string;
  blockTimestamp: number;
}

export const getUserStats = async (address: Address) => {
  const clients = getGraphClients();
  const queries = clients.map((client) =>
    client.query({
      query: gql`
        {
          Donates(where: { from: "${address}" }){
            from
            stable
            amount
            auction
            blockTimestamp
          }
        }
      `,
    })
  );

  const userInfo: Record<string, UserInfo> = {};

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
