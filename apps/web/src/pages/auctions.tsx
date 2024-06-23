import { useEffect, useState } from 'react';
import { httpClient } from '@/api/client';
import { ShadowCard } from '@/components/common/shadow-card';
import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { GET_ALL_AUCTIONS, GetAllAuctionsResponse } from '@/graph/queries/get-all-auctions';
import { useDefaultSubgraphQuery } from '@/hooks/useDefaultSubgraphQuery';
import { getShadowCardBg, getShadowCardVariant } from '@/lib/shadow-card-variant';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '@/components/ui/spinner';

type AuctionMetadata = {
  name: string;
  description: string;
  uri: string;
};

export default function Auctions() {
  const navigate = useNavigate();

  const { data, loading } = useDefaultSubgraphQuery<GetAllAuctionsResponse>(GET_ALL_AUCTIONS);

  const endedAuctionIds = new Set(data?.auctionEndeds.map((auction) => auction.id));
  const initialActiveAuctions = data?.auctionCreateds.filter((auction) => !endedAuctionIds.has(auction.id));

  const [activeAuctions, setActiveAuctions] = useState(initialActiveAuctions);
  const [auctionData, setAuctionData] = useState<{
    [key: string]: AuctionMetadata;
  }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (initialActiveAuctions) {
      setActiveAuctions(initialActiveAuctions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    const fetchImages = async () => {
      if (!activeAuctions) return;

      setIsLoading(true);
      const auctionData: { [key: string]: AuctionMetadata } = {};

      try {
        await Promise.all(
          activeAuctions.map(async (auction) => {
            try {
              const response = await httpClient.get<AuctionMetadata>(`${auction.uri}0`);
              if (response.data) {
                auctionData[auction.id] = response.data;
              } else {
                console.error(`Failed to fetch image for auction ${auction.id}: ${response.statusText}`);
              }
            } catch (error) {
              console.error(`Error fetching image for auction ${auction.id}:`, error);
            }
          })
        );
        setAuctionData(auctionData);
      } catch (error) {
        console.error('Error fetching auction images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [activeAuctions]);

  const handleParticipate = (address: string) => {
    navigate(`auctions/${address}`);
  };

  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col gap-2 lg:gap-4 text-center">
        <h1 className="text-4xl font-medium">List of available auctions</h1>
        <p className="px-4 lg:px-12 xl:px-16">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tenetur perspiciatis sit saepe ex earum soluta,
          repellat voluptatem doloremque cupiditate veritatis id? Magnam consectetur expedita repellat soluta. Eius
          praesentium est error.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        {isLoading || loading ? (
          <div className="text-center py-4">
            <Spinner />
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeAuctions?.map(({ id, address }, i) => (
              <ShadowCard key={id} variant={getShadowCardVariant(i)}>
                <CardHeader>
                  <CardTitle className={cn(getShadowCardBg(i), 'rounded-[16px] py-2 text-center')}>
                    {auctionData[id]?.name}
                  </CardTitle>
                  <CardDescription className="text-slate-800">{auctionData[id]?.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <img src={auctionData[id]?.uri} alt={`Can't get ${auctionData[id]?.uri}`} />
                </CardContent>
                <CardFooter className="flex justify-end my-4 py-0">
                  <Button onClick={() => handleParticipate(address)} className="w-full">
                    Participate
                  </Button>
                </CardFooter>
              </ShadowCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
