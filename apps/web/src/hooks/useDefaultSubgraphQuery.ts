import { getClientByChainId } from '@/graph';
import type { DocumentNode, OperationVariables, TypedDocumentNode } from '@apollo/client';
import { useQuery } from '@apollo/client';
import { useChainId } from 'wagmi';

export const useDefaultSubgraphQuery = <T>(
  query: DocumentNode | TypedDocumentNode<T, OperationVariables>,
  options: Record<string, unknown> = {}
) => {
  const chainId = useChainId();
  const client = getClientByChainId(chainId);

  const { called, data, loading, networkStatus, refetch, startPolling, stopPolling, error } = useQuery(query, {
    client,
    ...options,
  });

  console.log('useDefaultSubgraphQuery error ==>', error);

  return {
    called,
    data,
    loading,
    networkStatus,
    refetch,
    startPolling,
    stopPolling,
    error,
  };
};
