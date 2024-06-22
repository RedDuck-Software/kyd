import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, concat } from '@apollo/client';
import { polygonMumbai, scrollSepolia } from 'viem/chains';

type Chains = typeof polygonMumbai | typeof scrollSepolia;

export function getChainName(chain: Chains): string {
  return chain.name;
}

const getHttpLink = (chain: Chains) => {
  let uri;

  switch (chain.name) {
    case 'Polygon Mumbai':
      uri = 'https://api.thegraph.com/subgraphs/name/mrjeleika/kyd-polygon';
      break;
    case 'Scroll Sepolia':
      uri = 'https://api.thegraph.com/subgraphs/name/mrjeleika/kyd-optimism';
      break;

    default:
      uri = 'https://api.thegraph.com/subgraphs/name/mrjeleika/kyd';
      break;
  }

  return new HttpLink({ uri, fetch });
};

// Setup Apollo client.
const authLink = new ApolloLink((operation, forward) => {
  return forward(operation);
});

export const createApolloClient = (chain: Chains) => {
  const httpLink = getHttpLink(chain);

  return new ApolloClient({
    link: concat(authLink, httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache',
      },
      watchQuery: {
        fetchPolicy: 'no-cache',
        nextFetchPolicy: 'no-cache',
      },
    },
  });
};

export const getGraphClients = () => {
  const polygonClient = createApolloClient(polygonMumbai);
  const scrollClient = createApolloClient(scrollSepolia);

  return [polygonClient, scrollClient];
};