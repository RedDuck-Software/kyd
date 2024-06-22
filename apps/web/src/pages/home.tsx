import { useEffect, useState } from 'react';
import { httpClient } from '@/api/client';
import { ShadowCard } from '@/components/common/shadow-card';
import { TrandingAuctions } from '@/components/home/tranding-auctions';
import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { GET_ALL_AUCTIONS, GetAllAuctionsResponse } from '@/graph/queries/get-all-auctions';
import { useDefaultSubgraphQuery } from '@/hooks/useDefaultSubgraphQuery';
import { getShadowCardBg, getShadowCardVariant } from '@/lib/shadow-card-variant';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

type AuctionMetadata = {
  name: string;
  description: string;
  uri: string;
};

export default function Home() {
  const navigate = useNavigate();

  const { data } = useDefaultSubgraphQuery<GetAllAuctionsResponse>(GET_ALL_AUCTIONS);

  const endedAuctionIds = new Set(data?.auctionEndeds.map((auction) => auction.id));
  const activeAuctions = data?.auctionCreateds.filter((auction) => !endedAuctionIds.has(auction.id));

  const [auctionData, setAuctionData] = useState<{
    [key: string]: AuctionMetadata;
  }>({});

  useEffect(() => {
    const fetchImages = async () => {
      const auctionData: { [key: string]: AuctionMetadata } = {};

      if (!activeAuctions) return;

      console.log(1);

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
    };

    fetchImages();
  }, [activeAuctions]);

  const handleParticipate = (address: string) => {
    navigate(`auctions/${address}`);
  };

  return (
    <div className="flex flex-col gap-32">
      <div className="flex flex-col gap-2 lg:gap-4 text-center">
        <h1 className="text-4xl font-medium">Welcome to Know Your Donation!</h1>
        <p className="px-4 lg:px-12 xl:px-16">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tenetur perspiciatis sit saepe ex earum soluta,
          repellat voluptatem doloremque cupiditate veritatis id? Magnam consectetur expedita repellat soluta. Eius
          praesentium est error.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-[32px] font-semibold">Top active auctions</h2>
        <div className="w-full grid grid-cols-3 gap-8">
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
      </div>
      <TrandingAuctions />
    </div>
  );
}
