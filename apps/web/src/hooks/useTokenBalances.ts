import { AllowedChainIds, Token, allowedTokens } from '@/constants/addresses';
import { contractAddresses } from '@/constants/constants';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { erc20Abi, maxUint256 } from 'viem';
import { useAccount, useBalance, useBlockNumber, useReadContracts } from 'wagmi';

export interface TokenBalance extends Token {
  balance: bigint;
  allowance: bigint;
}

export const useTokenBalances = (chainId: AllowedChainIds) => {
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
    if (blockNumber) {
      queryClient.invalidateQueries({ queryKey: queryKeyAllowances });
      queryClient.invalidateQueries({ queryKey: queryKeyBalances });
    }
  }, [queryClient, queryKeyAllowances, queryKeyBalances, blockNumber]);

  return useMemo(() => {
    if (!balances || !allowances) return [];
    return tokens.map((token, i) =>
      token.address
        ? ({ ...token, balance: balances[i - 1], allowance: allowances[i - 1] } as TokenBalance)
        : ({ ...token, balance: nativeBalanceData?.value ?? BigInt(0), allowance: maxUint256 } as TokenBalance)
    );
  }, [allowances, balances, nativeBalanceData?.value, tokens]);
};
