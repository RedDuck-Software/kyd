import { ApolloClient, ApolloClientOptions, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { sepolia } from 'viem/chains';

const getClient = (uri: string, params?: Omit<ApolloClientOptions<NormalizedCacheObject>, 'uri' | 'cache'>) =>
  new ApolloClient({
    uri: uri,
    cache: new InMemoryCache(),
    ...params,
  });

const subgraphs: Record<string, string> = {
  [sepolia.id]: 'https://api.studio.thegraph.com/query/49166/kyd-sepolia/v1.0.6',
};

const clientsPerChain = Object.fromEntries(Object.entries(subgraphs).map(([key, val]) => [key, getClient(val)]));

export const getClientByChainId = (id?: number) => {
  id = id ?? sepolia.id;
  if (!clientsPerChain[id]) id = sepolia.id;
  return clientsPerChain[id];
};
