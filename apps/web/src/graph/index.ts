import { ApolloClient, ApolloClientOptions, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { polygon, scrollSepolia, sepolia } from 'viem/chains';

const getClient = (uri: string, params?: Omit<ApolloClientOptions<NormalizedCacheObject>, 'uri' | 'cache'>) =>
  new ApolloClient({
    uri: uri,
    cache: new InMemoryCache(),
    ...params,
  });

export const subgraphs: Record<string, string> = {
  [sepolia.id]: 'https://api.studio.thegraph.com/query/9868/kyd-sep/v0.0.5',
  [scrollSepolia.id]: 'https://api.studio.thegraph.com/query/49166/kyd-scroll-sepolia/v0.0.1',
  [polygon.id]: 'https://api.studio.thegraph.com/query/49166/kyd-polygon/v1.0.0',
};

const clientsPerChain = Object.fromEntries(Object.entries(subgraphs).map(([key, val]) => [key, getClient(val)]));

export const getClientByChainId = (id?: number) => {
  id = id ?? sepolia.id;
  if (!clientsPerChain[id]) id = sepolia.id;
  return clientsPerChain[id];
};
