import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useTokenBalance } from '@/hooks/queries/use-token-balance';
import useDonateStore from '@/store/donate-store';
import { ShadowCard } from '../common/shadow-card';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { getShadowCardFilledVariant } from '@/lib/shadow-card-variant';
import { Address, erc20Abi, formatUnits, parseUnits } from 'viem';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useToast } from '../ui/use-toast';
import { Loader2 } from 'lucide-react';
import {
  useAccount,
  useBlockNumber,
  useChainId,
  usePublicClient,
  useReadContract,
  useSimulateContract,
  useSwitchChain,
  useWriteContract,
} from 'wagmi';
import { contractAddresses } from '@/constants/constants';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { auctionAbi } from '@/abi/auctionABI';
import { useQueryClient } from '@tanstack/react-query';
import { Nodes, getIndexesForInsert } from './utils';
import { quoterAbi } from '@/abi/quoterABI';
import { addresses } from '@/constants/addresses';

const slippages = [1, 2, 5, 10];

export const AuctionDonate = () => {
  const auctionChainId = 11155111;
  const { data: tokenBalances } = useTokenBalance(auctionChainId);

  const [slippage, setSlippage] = useState(slippages[1]);
  const [isLoading, setLoading] = useState(false);

  const [parent] = useAutoAnimate();
  const { address } = useAccount();
  const { switchChainAsync } = useSwitchChain({});

  const { data: blockNumber } = useBlockNumber({ watch: true, chainId: auctionChainId });

  const { amount, chain: selectedChain, setAmount, setToken, token: selectedToken } = useDonateStore();
  const queryClient = useQueryClient();

  const isAllowanceEnough = useMemo(() => {
    const token = tokenBalances?.find((token) => token.symbol === selectedToken.symbol);

    return token && amount ? token.allowance >= parseUnits(amount.toString(), token.decimals) : false;
  }, [amount, selectedToken.symbol, tokenBalances]);

  const isBalanceEnough = useMemo(() => {
    const token = tokenBalances?.find((token) => token.symbol === selectedToken.symbol);

    return token && amount ? token.balance >= parseUnits(amount.toString(), token.decimals) : false;
  }, [amount, selectedToken.symbol, tokenBalances]);

  const isNative = useMemo(() => {
    return !selectedToken.address;
  }, [selectedToken.address]);

  const { toast } = useToast();
  const chainId = useChainId();

  const { data: nodesRes, queryKey: getNodesQueryKey } = useReadContract({
    abi: auctionAbi,
    address: contractAddresses[auctionChainId],
    chainId: auctionChainId,
    functionName: 'getNodes',
  });

  useEffect(() => {
    if (blockNumber) {
      queryClient.invalidateQueries({ queryKey: getNodesQueryKey });
    }
  }, [queryClient, blockNumber, getNodesQueryKey]);

  const { writeContractAsync: approveAsync } = useWriteContract();
  const { writeContractAsync: donateNativeAsync } = useWriteContract();
  const { writeContractAsync: donateTokenAsync } = useWriteContract();

  const { data: simulateRes } = useSimulateContract({
    abi: quoterAbi,
    functionName: 'quoteExactInput',
    chainId: auctionChainId,
    address: addresses[auctionChainId].uniQuoter,
    args: [addresses[auctionChainId].swapPath, parseUnits(amount ? amount.toString() : '0', selectedToken.decimals)],
  });

  const simulatedAmount = useMemo(() => {
    return simulateRes ? (simulateRes.result[0] / 100n) * BigInt(100 - slippage) : null;
  }, [simulateRes, slippage]);

  const approve = useCallback(async () => {
    const hash = await approveAsync({
      abi: erc20Abi,
      address: selectedToken.address as Address,
      functionName: 'approve',
      args: [contractAddresses[auctionChainId], parseUnits(amount!.toString(), 18)],
    });

    return hash;
  }, [amount, approveAsync, selectedToken.address]);

  const donateNative = useCallback(async () => {
    const hash = await donateNativeAsync({
      abi: auctionAbi,
      address: contractAddresses[auctionChainId],
      functionName: 'donateEth',
      value: parseUnits(amount!.toString(), 18),
      args: [
        ...getIndexesForInsert(nodesRes!.slice() as Nodes, address!, simulatedAmount ?? 0n),
        simulatedAmount ?? 0n,
      ],
    });

    return hash;
  }, [address, amount, donateNativeAsync, nodesRes, simulatedAmount]);

  const donateToken = useCallback(async () => {
    const hash = await donateTokenAsync({
      abi: auctionAbi,
      address: contractAddresses[auctionChainId],
      functionName: 'donate',
      args: [
        selectedToken.address! as `0x${string}`,
        parseUnits(amount!.toString(), 18),
        ...getIndexesForInsert(nodesRes!.slice() as Nodes, address!, parseUnits(amount!.toString(), 18)),
      ],
    });

    return hash;
  }, [address, amount, donateTokenAsync, nodesRes, selectedToken.address]);

  const publicClient = usePublicClient();

  const handleButtonClick = useCallback(async () => {
    setLoading(true);
    try {
      if (chainId !== auctionChainId) {
        await switchChainAsync({ chainId: auctionChainId });
      } else {
        const hash = await (isNative ? donateNative() : isAllowanceEnough ? donateToken() : approve());
        await publicClient?.waitForTransactionReceipt({
          hash,
        });
        toast({ title: 'Transaction success', variant: 'default' });
      }
    } catch (error) {
      console.log(error);

      toast({
        variant: 'destructive',
        title: 'Error occurred',
        description: (error as Error).message ?? 'There was an error',
      });
    } finally {
      setLoading(false);
    }
  }, [approve, chainId, donateNative, donateToken, isAllowanceEnough, isNative, publicClient, switchChainAsync, toast]);

  const buttonText = useMemo(() => {
    if (!amount || amount === 0) return 'Enter amount to donate';
    if (chainId !== auctionChainId) return 'Switch chain';
    if (!isAllowanceEnough) return 'Approve';
    if (!isBalanceEnough) return `Not enough ${selectedToken.symbol}`;
    return 'Make world better';
  }, [amount, chainId, isAllowanceEnough, isBalanceEnough, selectedToken.symbol]);
  const { open } = useWeb3Modal();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-3xl font-semibold">Make impact</h2>
      {address ? (
        <div className="flex flex-col gap-6">
          <div className=" flex flex-col gap-4">
            <h6 className="font-medium text-[20px]">Chain:</h6>
            <ShadowCard
              // variant={auctionChainId === 80001 ? 'violent' : 'orange'}
              variant={'orange'}
              className="flex items-center gap-2  transition-colors w-[200px] rounded-[4px]"
            >
              <img src={selectedChain.image} alt={selectedChain.name} className="w-10" />
              <p>{selectedChain.name}</p>
            </ShadowCard>
          </div>
          <div className=" flex flex-col gap-4">
            <h6 className="font-medium text-[20px]">Select token:</h6>
            <div ref={parent} className="flex gap-6 ">
              {tokenBalances?.map((token, i) =>
                selectedToken.symbol === token.symbol ? (
                  <button>
                    <ShadowCard
                      variant={getShadowCardFilledVariant(i)}
                      className="flex items-center gap-2 justify-center py-2 rounded-[10px]  transition-colors w-[200px] "
                    >
                      <img src={token.image} alt={token.symbol} className="w-8 h-8" />
                      <p>
                        {parseFloat(formatUnits(token.balance, token.decimals)).toFixed(4)} {token.symbol}
                      </p>
                    </ShadowCard>
                  </button>
                ) : (
                  <button
                    onClick={() => setToken(token)}
                    className="flex w-[200px] border-[3px] border-transparent justify-center transition-colors  items-center gap-2"
                  >
                    <img src={token.image} alt={token.symbol} className="w-8 h-8" />
                    <p>
                      {parseFloat(formatUnits(token.balance, token.decimals)).toFixed(4)} {token.symbol}
                    </p>
                  </button>
                )
              )}
            </div>
          </div>
          <div className=" flex flex-col gap-4">
            <div className="flex justify-between items-end">
              <h6 className="font-medium text-[20px]">Amount:</h6>
              <div className="flex font-medium gap-2 items-center">
                <p>Slippage:</p>
                <div className="flex items-center gap-4">
                  {slippages.map((configSlippage) =>
                    configSlippage === slippage ? (
                      <button>
                        <ShadowCard className="rounded-[4px] py-1 px-2" variant="violent">
                          {configSlippage}%
                        </ShadowCard>
                      </button>
                    ) : (
                      <button
                        className="border-[3px] py-1 px-2 border-transparent"
                        onClick={() => setSlippage(configSlippage)}
                      >
                        {configSlippage}%
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
            <div className="">
              <Input
                value={amount ?? ''}
                onChange={(e) => {
                  console.log(e.target.value);

                  setAmount(e.target.value && parseFloat(e.target.value) >= 0 ? parseFloat(e.target.value) : null);
                }}
                type="number"
                placeholder="Amount..."
                className="appearance-none text-xl p-5 rounded-[10px]"
              />
            </div>
          </div>
          <Button
            ref={parent}
            onClick={handleButtonClick}
            disabled={
              isLoading || !amount || !isBalanceEnough || amount === 0 || (!selectedToken.address && !simulateRes)
            }
            className="py-3 w-full text-lg flex gap-3"
          >
            {isLoading && <Loader2 className="transition-all animate-spin  [&_path]:stroke-white w-5 h-5" />}
            {buttonText}
            {isLoading && <div className=" w-5 h-5" />}
          </Button>
        </div>
      ) : (
        <Button onClick={() => open()} className="py-3 w-full text-lg flex gap-3">
          Connect wallet
        </Button>
      )}
    </div>
  );
};
