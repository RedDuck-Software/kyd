import { gql } from '@apollo/client';
import { getGraphClients } from '../client';

export const getAuctionUri = async (address: string, chainId: number) => {
  const clients = getGraphClients();
  const client = clients.find((client) => client.chainId === chainId)!;

  const query = client.client.query({
    query: gql`
      {
        auctionCreateds(where: { address: "${address}" }) {
          uri
        }
      }
    `,
  });

  const response = await query;

  console.log(response);

  return response.data.auctionCreateds[0].uri as string;
};
