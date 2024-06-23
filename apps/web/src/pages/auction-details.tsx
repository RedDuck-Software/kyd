import { useParams } from 'react-router-dom';
import 'swiper/css';
import { AuctionParticipants } from '@/components/auction/auction-participants';
import { AuctionDonate } from '@/components/auction/auction-donate';
import { AuctionProgress } from '@/components/auction/auction-progress';
import { useAuctionMetadata } from '@/hooks/queries/use-auction-metadata';
import { useMemo } from 'react';
import { AuctionMetadata } from './home';
import { PageLoader } from '@/components/page-loader/page-loader';

export default function AuctionDetails() {
  const { id } = useParams();
  const [address, auctionChainId] = id!.split(':');

  const { data, isLoading } = useAuctionMetadata(address, +auctionChainId);

  const metadata: AuctionMetadata = useMemo(() => {
    return data?.data ?? { description: '', name: '', uri: '' };
  }, [data?.data]);

  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col gap-4">
        {isLoading || !data ? (
          <PageLoader />
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-semibold">{metadata.name}</h1>
              <p className="text-base">{metadata.description}</p>
            </div>
            <div className="flex justify-center">
              <img className="max-w-[500px] aspect-square object-cover" src={metadata.uri} />
            </div>
          </>
        )}
      </div>
      <AuctionProgress />
      <AuctionDonate />
      <AuctionParticipants />
    </div>
  );
}
