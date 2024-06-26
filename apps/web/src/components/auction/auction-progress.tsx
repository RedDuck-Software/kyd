import { useBlockNumber, useReadContract } from 'wagmi';
import { Progress } from '../ui/progress';
import { useEffect, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { auctionAbi } from '@/abi/auctionABI';
import { formatUnits } from 'viem';
import { useParams } from 'react-router-dom';

export const AuctionProgress = () => {
  const { id } = useParams();

  const [address, auctionChainId] = id!.split(':');

  const queryClient = useQueryClient();

  const { data: goalRes, queryKey: getGoalQueryKey } = useReadContract({
    abi: auctionAbi,
    address: address as `0x${string}`,
    chainId: +auctionChainId,
    functionName: 'goal',
  });

  const { data: totalDonatedRes, queryKey: getTotalDonatedQueryKey } = useReadContract({
    abi: auctionAbi,
    address: address as `0x${string}`,
    chainId: +auctionChainId,
    functionName: 'totalDonated',
  });

  const { data: blockNumber } = useBlockNumber({ watch: true, chainId: +auctionChainId });

  const goal = useMemo(() => {
    return goalRes ? parseFloat(formatUnits(goalRes, 18)) : 0;
  }, [goalRes]);

  const totalDonated = useMemo(() => {
    return totalDonatedRes ? parseFloat(formatUnits(totalDonatedRes, 18)) : 0;
  }, [totalDonatedRes]);

  const progress = useMemo(() => {
    if (goal === 0) {
      return 0;
    }
    const val = (totalDonated / goal) * 100;
    return val >= 100 ? 100 : val;
  }, [goal, totalDonated]);

  console.log('progress ==>', progress);

  useEffect(() => {
    if (blockNumber) {
      queryClient.invalidateQueries({ queryKey: getGoalQueryKey });
      queryClient.invalidateQueries({ queryKey: getTotalDonatedQueryKey });
    }
  }, [queryClient, getGoalQueryKey, getTotalDonatedQueryKey, blockNumber]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-between">
        <h2 className="text-3xl font-semibold">Progress</h2>
        <p className="text-[16px] font-medium">{progress.toFixed(2)}%</p>
      </div>

      <div className="flex flex-col gap-6">
        <Progress className="border-dark border bg-light" value={progress} />
      </div>
      <div className="flex items-start justify-between">
        <p className="text-[18px] font-medium">
          Already raised: <span className="text-blue">{totalDonated.toFixed(2)}$</span>
        </p>
        <p className="text-[18px] font-medium">
          Raise goal:<span className="text-violent"> {goal.toFixed(2)}$</span>
        </p>
      </div>
    </div>
  );
};
