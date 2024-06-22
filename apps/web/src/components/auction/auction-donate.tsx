import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useTokenBalance } from '@/hooks/queries/use-token-balance';
import useDonateStore from '@/store/donate-store';
import { ShadowCard } from '../common/shadow-card';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { getShadowCardFilledVariant } from '@/lib/shadow-card-variant';
import { Address, erc20Abi, formatUnits, parseUnits } from 'viem';
import { useCallback, useMemo, useState } from 'react';
import { useToast } from '../ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useChainId, usePublicClient, useSwitchChain, useWriteContract } from 'wagmi';
import { contractAddresses } from '@/constants/constants';

export const AuctionDonate = () => {
  const { data: tokenBalances } = useTokenBalance(534351);

  const [isLoading, setLoading] = useState(false);

  const [parent] = useAutoAnimate();

  const { switchChainAsync } = useSwitchChain({});

  const { amount, chain: selectedChain, setAmount, setDonateChain, setToken, token: selectedToken } = useDonateStore();

  const isAllowanceEnough = useMemo(() => {
    const token = tokenBalances?.find((token) => token.symbol === selectedToken.symbol);

    return token && amount ? token.allowance >= parseUnits(amount.toString(), token.decimals) : false;
  }, [amount, selectedToken.symbol, tokenBalances]);

  const isBalanceEnough = useMemo(() => {
    const token = tokenBalances?.find((token) => token.symbol === selectedToken.symbol);

    return token && amount ? token.balance >= parseUnits(amount.toString(), token.decimals) : false;
  }, [amount, selectedToken.symbol, tokenBalances]);

  const isNative = useMemo(() => {
    return !!selectedToken.address;
  }, [selectedToken.address]);

  const { toast } = useToast();
  const chainId = useChainId();

  const { writeContractAsync: approveAsync, isPending: isLoadingApprove } = useWriteContract();

  const approve = useCallback(async () => {
    const hash = await approveAsync({
      abi: erc20Abi,

      address: selectedToken.address as Address,
      functionName: 'approve',
      args: [contractAddresses[selectedChain.id], parseUnits(amount!.toString(), 18)],
    });

    return hash;
  }, [amount, approveAsync, selectedChain.id, selectedToken.address]);
  const publicClient = usePublicClient();

  const handleButtonClick = useCallback(async () => {
    setLoading(true);
    try {
      if (chainId !== selectedChain.id) {
        await switchChainAsync({ chainId: selectedChain.id });
      } else {
        const hash = await (isNative ? approve() : isAllowanceEnough ? approve() : approve());
        await publicClient?.waitForTransactionReceipt({
          hash,
        });
        toast({ title: 'Transaction success', variant: 'default' });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error occurred',
        description: (error as Error).message ?? 'There was an error',
      });
    } finally {
      setLoading(false);
    }
  }, [approve, chainId, isAllowanceEnough, isNative, publicClient, selectedChain.id, switchChainAsync, toast]);

  const buttonText = useMemo(() => {
    if (!amount || amount === 0) return 'Enter amount to donate';
    if (chainId !== selectedChain.id) return 'Switch chain';
    if (!isAllowanceEnough) return 'Approve';
    if (!isBalanceEnough) return `Not enough ${selectedToken.symbol}`;
    return 'Make world better';
  }, [amount, chainId, isAllowanceEnough, isBalanceEnough, selectedChain.id, selectedToken.symbol]);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[32px] font-semibold">Make impact</h2>
      <div className="flex flex-col gap-6">
        <div className=" flex flex-col gap-4">
          <h6 className="font-medium text-[20px]">Chain:</h6>
          <ShadowCard
            variant={selectedChain.id === 80001 ? 'violent' : 'orange'}
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
          <h6 className="font-medium text-[20px]">Amount:</h6>
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
          disabled={isLoading || !amount || !isBalanceEnough || amount === 0}
          className="py-3 w-full text-lg flex gap-3"
        >
          {isLoading && <Loader2 className="transition-all animate-spin  [&_path]:stroke-white w-5 h-5" />}
          {buttonText}
          {isLoading && <div className=" w-5 h-5" />}
        </Button>
      </div>
    </div>
  );
};
