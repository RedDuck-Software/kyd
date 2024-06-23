import { redirect, useParams } from 'react-router-dom';
import 'swiper/css';
import { AuctionParticipants } from '@/components/auction/auction-participants';
import { AuctionDonate } from '@/components/auction/auction-donate';
import { AuctionProgress } from '@/components/auction/auction-progress';
import { useAccount, useReadContract } from 'wagmi';
import { auctionAbi } from '@/abi/auctionABI';
import { getAddress, isAddress } from 'viem';
import { Spinner } from '@/components/ui/spinner';
import { AdminAuction } from '@/components/auction/admin-auction';

export default function AuctionDetails() {
  const { id } = useParams();
  const { address } = useAccount();

  if (!id || !isAddress(id)) {
    redirect('/');
  }

  const { data: isFinished, isLoading: isLoadingFinished } = useReadContract({
    abi: auctionAbi,
    address: getAddress(id!),
    functionName: 'randomnessRequested',
  });

  const { data: isDistributed, isLoading: isLoadingDistributed } = useReadContract({
    abi: auctionAbi,
    address: getAddress(id!),
    functionName: 'nftsDistributed',
  });

  const { data: owner, isLoading } = useReadContract({
    abi: auctionAbi,
    address: getAddress(id!),
    functionName: 'owner',
  });

  if (isLoading || isLoadingDistributed || isLoadingFinished) {
    return (
      <div className="flex w-full justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold">{id} Auction Details</h1>
          <p className="text-base">
            {id} Auction long description lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore ipsa
            doloribus accusantium eius nam cum natus perspiciatis. Alias, ratione numquam! Quod, ducimus id eaque totam
            saepe a ipsam distinctio sunt.lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore ipsa
            doloribus accusantium eius nam cum natus perspiciatis. Alias, ratione numquam! Quod, ducimus id eaque totam
            saepe a ipsam distinctio sunt.
          </p>
        </div>
      </div>
      <AuctionProgress />
      {owner === address && (
        <AdminAuction isDistributed={isDistributed!} isFinished={isFinished!} address={getAddress(id!)} />
      )}
      {isFinished ? (
        isDistributed ? (
          <p className="text-3xl font-semibold self-center">Auction is closed</p>
        ) : (
          <p className="text-3xl font-semibold self-center">
            Auction is finished, but rewards haven't been distributed yet!
          </p>
        )
      ) : (
        <AuctionDonate />
      )}
      <AuctionParticipants />
    </div>
  );
}
