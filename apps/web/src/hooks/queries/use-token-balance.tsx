import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useAccount, useBalance, useBlockNumber, useReadContracts } from 'wagmi';
import { contractAddresses } from '@/constants/constants';
import { useEffect, useMemo } from 'react';
import { erc20Abi, maxUint256 } from 'viem';
import { TokenBalance } from '../useTokenBalances';
import { AllowedChainIds, allowedTokens } from '@/constants/addresses';

export const useTokenBalance = (chainId: AllowedChainIds) => {
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
      address
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
            args: address ? [address, contractAddresses[chainId]] : undefined,
          }) as const
      ),
    [address, balancesContracts, chainId]
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
    queryClient.invalidateQueries({ queryKey: queryKeyAllowances });
    queryClient.invalidateQueries({ queryKey: queryKeyBalances });
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

      return tokens.map((token, i) =>
        token.address
          ? ({
              ...token,
              balance: balances ? balances[i - 1] : BigInt(0),
              allowance: allowances ? allowances[i - 1] : BigInt(0),
            } as TokenBalance)
          : ({ ...token, balance: nativeBalanceData?.value ?? BigInt(0), allowance: maxUint256 } as TokenBalance)
      );
    },
  });
};
