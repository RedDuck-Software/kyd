import { gql } from '@apollo/client';
import { Address } from 'viem';
import { getGraphClients } from '../client';

export const getUserAdminAuctions = async (user: Address) => {
  const clients = getGraphClients();

  console.log({ user });

  user = '0x6e2f1d7ee2aa23007448810bd21bbccce07ff21c';

  const queries = await Promise.all(
    clients.map(async (client) => ({
      result: client.client.query({
        query: gql`
        {
            auctionCreateds(where: { owner: "${user}" }) {
              id
              address
              uri
              owner
              blockNumber
              blockTimestamp
              transactionHash
            }
        }
        `,
      }),
    }))
  );

  const results = await Promise.all(queries);

  return Object.entries(results);
};
