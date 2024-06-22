import { Address } from 'viem';
import { getGraphClients } from '../client';
import { gql } from '@apollo/client';

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
          }
        }
      `,
    })
  );
};
