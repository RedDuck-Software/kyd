import { useEffect, useMemo, useState } from 'react';
import { httpClient } from '@/api/client';
import { ShadowCard } from '@/components/common/shadow-card';
import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getShadowCardBg, getShadowCardVariant } from '@/lib/shadow-card-variant';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '@/components/ui/spinner';
import { useAllAuctions } from '@/hooks/queries/use-all-auctions';

export type AuctionMetadata = {
  name: string;
  description: string;
  uri: string;
};

export default function Home() {
  const navigate = useNavigate();

  const { data: allAuctions, isLoading: loading } = useAllAuctions();

  const [auctionData, setAuctionData] = useState<{
    [key: string]: AuctionMetadata;
  }>({});
  const [isLoading, setIsLoading] = useState(true);

  const activeAuctions = useMemo(() => {
    const endedAuctionIds = new Set(allAuctions?.auctionEndeds.map((auction) => auction.address));
    const initialActiveAuctions = allAuctions?.auctionCreateds.filter(
      (auction) => !endedAuctionIds.has(auction.address)
    );

    return initialActiveAuctions
      ? initialActiveAuctions.sort((a, b) => +b.blockTimestamp - +a.blockTimestamp).slice(0, 3)
      : [];
  }, [allAuctions]);

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

  const handleParticipate = (address: string, chainId: number) => {
    navigate(`/auctions/${address}:${chainId}`);
  };

  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col gap-2 lg:gap-4 text-center">
        <h1 className="text-4xl font-medium">Welcome to Know Your Donation!</h1>
        <p className="px-4 lg:px-12 xl:px-16">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tenetur perspiciatis sit saepe ex earum soluta,
          repellat voluptatem doloremque cupiditate veritatis id? Magnam consectetur expedita repellat soluta. Eius
          praesentium est error.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-semibold">Top active auctions</h2>
        {isLoading || loading ? (
          <div className="text-center py-4">
            <Spinner />
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeAuctions?.map(({ id, address, chainId }, i) => (
              <ShadowCard key={id} className="flex flex-col" variant={getShadowCardVariant(i)}>
                <CardHeader>
                  <CardTitle className={cn('rounded-[16px] text-center')}>{auctionData[id]?.name}</CardTitle>
                </CardHeader>
                <CardContent className="py-0 flex-1 px-12 flex justify-center rounded-[16px] ">
                  <img
                    src={auctionData[id]?.uri}
                    className="object-cover aspect-square  rounded-[16px] "
                    alt={`Can't get ${auctionData[id]?.uri}`}
                  />
                </CardContent>
                <CardDescription className="font-medium px-6">{auctionData[id]?.description}</CardDescription>

                <CardFooter className="flex justify-end my-4 py-0">
                  <Button
                    onClick={() => handleParticipate(address, chainId)}
                    className={cn(getShadowCardBg(i), 'w-full')}
                  >
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
