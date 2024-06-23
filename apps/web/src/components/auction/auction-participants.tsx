import { getShadowCardFilledVariant, getShadowCardText } from '@/lib/shadow-card-variant';
import { ShadowCard } from '../common/shadow-card';
import { generateBlockies } from '@/lib/blockies';
import { shortenAddress } from '@/lib/utils';
import { cn } from '../../lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { useBlockNumber, useReadContract } from 'wagmi';
import { auctionAbi } from '@/abi/auctionABI';
import { useEffect } from 'react';
import { formatUnits } from 'viem';
import { useParams } from 'react-router-dom';

export const AuctionParticipants = () => {
  const { id } = useParams();

  const [address, auctionChainId] = id!.split(':');

  const queryClient = useQueryClient();

  const { data: nodesRes, queryKey: getNodesQueryKey } = useReadContract({
    abi: auctionAbi,
    address: address as `0x${string}`,
    chainId: +auctionChainId,
    functionName: 'getNodes',
  });

  const { data: blockNumber } = useBlockNumber({ watch: true, chainId: +auctionChainId });

  useEffect(() => {
    if (blockNumber) {
      queryClient.invalidateQueries({ queryKey: getNodesQueryKey });
    }
  }, [queryClient, blockNumber, getNodesQueryKey]);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-3xl font-semibold">Donaters</h2>
      <div className="flex flex-col gap-6">
        {nodesRes && nodesRes.length > 0 ? (
          nodesRes.map((node, i) => (
            <ShadowCard
              key={node.data.user}
              variant={getShadowCardFilledVariant(i)}
              className="flex justify-between p-2 overflow-hidden items-center"
            >
              <div className="flex items-center gap-4">
                {generateBlockies(node.data.user as `0x${string}`, 25)}
                <h6 className="text-[18px] font-medium">{shortenAddress(node.data.user ?? '', 6)}</h6>
              </div>
              <p className={cn(getShadowCardText(i), ' text-[18px] font-bold')}>
                {parseFloat(formatUnits(node.data.amount, 18)).toFixed(2)}$
              </p>
            </ShadowCard>
          ))
        ) : (
          <p className="text-center text-[18px] font-medium">Become first donater!</p>
        )}
      </div>
    </div>
  );
};
