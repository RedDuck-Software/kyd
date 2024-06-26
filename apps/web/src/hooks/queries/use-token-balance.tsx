import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useAccount, useBalance, useBlockNumber, useReadContracts } from 'wagmi';
import { useEffect, useMemo } from 'react';
import { erc20Abi, maxUint256 } from 'viem';
import { TokenBalance } from '../useTokenBalances';
import { AllowedChainIds, allowedTokens } from '@/constants/addresses';

export const useTokenBalance = (chainId: AllowedChainIds, auction: string) => {
  const { address } = useAccount();
  const queryClient = useQueryClient();

  const tokens = allowedTokens[chainId];

  const { data: blockNumber } = useBlockNumber({ watch: true });

  const { data: nativeBalanceData } = useBalance({
    address,
    chainId,
  });

  const balancesContracts = useMemo(
    () =>
      address && tokens
        ? tokens
            .filter((token) => token.address)
            .map(
              (token) =>
                ({
                  address: token.address,
                  abi: erc20Abi,
                  functionName: 'balanceOf',
                  chainId,
                  watch: true,
                  args: [address],
                }) as const
            )
        : [],
    [address, chainId, tokens]
  );

  const allowancesContracts = useMemo(
    () =>
      balancesContracts.map(
        (balanceContract) =>
          ({
            ...balanceContract,
            watch: true,
            functionName: 'allowance',
            args: address ? [address, auction] : undefined,
          }) as const
      ),
    [address, auction, balancesContracts]
  );

  const { data: balances, queryKey: queryKeyBalances } = useReadContracts({
    allowFailure: false,
    // @ts-expect-error Filtered
    contracts: balancesContracts,
  });

  const { data: allowances, queryKey: queryKeyAllowances } = useReadContracts({
    // @ts-expect-error Filtered
    contracts: allowancesContracts,
    allowFailure: false,
  });

  useEffect(() => {
    if (blockNumber) {
      queryClient.invalidateQueries({ queryKey: queryKeyAllowances });
      queryClient.invalidateQueries({ queryKey: queryKeyBalances });
    }
  }, [queryClient, queryKeyAllowances, queryKeyBalances, blockNumber]);

  return useQuery({
    queryKey: ['balance', address],
    enabled: Boolean(address),
    refetchInterval: 10 * 1000,
    queryFn: async () => {
      if ((!balances || !allowances) && !nativeBalanceData)
        return tokens.map((token) => {
          return { ...token, balance: BigInt(0), allowance: BigInt(0) } as TokenBalance;
        });

      return [
        ...(tokens ?? [])
          .filter((token) => !token.address)
          .map((token) => {
            return {
              ...token,
              balance: nativeBalanceData?.value as bigint,
              allowance: maxUint256 as bigint,
            };
          }),
        ...(tokens ?? [])
          .filter((token) => token.address)
          .map((token, i) => {
            return {
              ...token,
              balance: balances ? (balances[i] as bigint) : 0n,
              allowance: allowances ? (allowances[i] as bigint) : 0n,
            };
          }),
      ];
    },
  });
};
