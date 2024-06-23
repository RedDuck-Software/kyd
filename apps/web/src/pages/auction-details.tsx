import { useParams } from 'react-router-dom';
import 'swiper/css';
import { AuctionParticipants } from '@/components/auction/auction-participants';
import { AuctionDonate } from '@/components/auction/auction-donate';
import { AuctionProgress } from '@/components/auction/auction-progress';
import { useAuctionMetadata } from '@/hooks/queries/use-auction-metadata';
import { useMemo } from 'react';
import { AuctionMetadata } from './home';

export default function AuctionDetails() {
  const { id } = useParams();
  const [address, auctionChainId] = id!.split(':');

  const { data } = useAuctionMetadata(address, +auctionChainId);

  const metadata: AuctionMetadata = useMemo(() => {
    return data?.data ?? { description: '', name: '', uri: '' };
  }, [data?.data]);

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
      <AuctionDonate />
      <AuctionParticipants />
    </div>
  );
}
