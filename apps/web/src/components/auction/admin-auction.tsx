import { auctionAbi } from '@/abi/auctionABI';
import { Address } from 'viem';
import { useAccount, useWriteContract } from 'wagmi';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

export const AdminAuction = ({
  address,
  isFinished,
  isDistributed,
}: {
  address: Address;
  isFinished: boolean;
  isDistributed: boolean;
}) => {
  const { address: userAddress } = useAccount();

  const { writeContractAsync: finishAuction, isPending: isLoadingFinish } = useWriteContract();
  const { writeContractAsync: distributeRewards, isPending: isLoadingDistribute } = useWriteContract();

  if (isFinished && isDistributed) {
    return;
  }

  return (
    <div className="flex flex-col gap-4">
      {!isFinished && (
        <Button
          onClick={async () =>
            await finishAuction({
              abi: auctionAbi,
              address,
              account: userAddress,
              functionName: 'finish',
            })
          }
          disabled={isLoadingFinish}
          className="py-3 w-full text-lg flex gap-3"
        >
          {isLoadingFinish && <Loader2 className="transition-all animate-spin  [&_path]:stroke-white w-5 h-5" />}
          {'Finish'}
          {isLoadingFinish && <div className="w-5 h-5" />}
        </Button>
      )}
      {isFinished && !isDistributed && (
        <Button
          onClick={async () =>
            await distributeRewards({
              abi: auctionAbi,
              address,
              account: userAddress,
              functionName: 'distributeRewards',
            })
          }
          disabled={isLoadingDistribute}
          className="py-3 w-full text-lg flex gap-3"
        >
          {isLoadingDistribute && <Loader2 className="transition-all animate-spin  [&_path]:stroke-white w-5 h-5" />}
          {'Distribute rewards'}
          {isLoadingDistribute && <div className="w-5 h-5" />}
        </Button>
      )}
    </div>
  );
};
