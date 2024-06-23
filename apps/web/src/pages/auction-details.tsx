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
import { useAuctionMetadata } from '@/hooks/queries/use-auction-metadata';
import { AuctionMetadata } from './home';
import { useMemo } from 'react';

export default function AuctionDetails() {
  const { id } = useParams();
  const [address, auctionChainId] = id!.split(':');
  const { address: userAddress } = useAccount();

  if (!id || !isAddress(address)) {
    redirect('/');
  }

  const { data: isFinished, isLoading: isLoadingFinished } = useReadContract({
    abi: auctionAbi,
    address: getAddress(address!),
    functionName: 'randomnessRequested',
  });

  const { data: isDistributed, isLoading: isLoadingDistributed } = useReadContract({
    abi: auctionAbi,
    address: getAddress(address!),
    functionName: 'nftsDistributed',
  });

  const { data: owner, isLoading } = useReadContract({
    abi: auctionAbi,
    address: getAddress(address!),
    functionName: 'owner',
  });

  const { data } = useAuctionMetadata(address, +auctionChainId);

  const metadata: AuctionMetadata = useMemo(() => {
    return data?.data ?? { description: '', name: '', uri: '' };
  }, [data?.data]);

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
          <h1 className="text-4xl font-semibold">{metadata.name}</h1>
          <p className="text-base">{metadata.description}</p>
        </div>
        <div className="flex justify-center">
          <img className="max-w-[500px]" src={metadata.uri} />
        </div>
      </div>
      <AuctionProgress />
      {owner === userAddress && (
        <AdminAuction isDistributed={isDistributed!} isFinished={isFinished!} address={getAddress(address)} />
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
