import { Address, formatUnits } from 'viem';
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
  amount: string;
  auction: string;
  blockTimestamp: number;
}

export const getUserPastAuctions = async (address: Address) => {
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
    }, )
  );

  let userInfo: UserInfo | null= null;

  const results = await Promise.all(queries);

  results.forEach((result) => {
    (result.data.donates as Donate[]).map((donate) => {
      if (!userInfo) {
        userInfo = { totalParticipated: 1, usdDonated: +formatUnits(BigInt(donate.amount), 18), won: 1 };
      } else {
        userInfo.totalParticipated += 1;
        userInfo.usdDonated += +formatUnits(BigInt(donate.amount), 18);
        userInfo.won += 1;
      }
    });
  });

  return (userInfo as UserInfo | null) ?? {
    totalParticipated: 0,
    usdDonated: 0,
    won: 0,
  };
};
