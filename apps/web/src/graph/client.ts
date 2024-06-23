import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, concat } from '@apollo/client';
import { polygonMumbai, scrollSepolia, sepolia } from 'viem/chains';
import { subgraphs } from '.';

type Chains = typeof polygonMumbai | typeof scrollSepolia | typeof sepolia;

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
      uri = subgraphs[scrollSepolia.id];
      break;
    case 'Sepolia':
      uri = subgraphs[sepolia.id];
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
  const sepoliaClient = createApolloClient(sepolia);
  const scrollClient = createApolloClient(scrollSepolia);

  return [
    { client: sepoliaClient, chainId: sepolia.id },
    { client: scrollClient, chainId: scrollSepolia.id },
  ];
};
