import { AUctionFactoryAbi } from '@/abi/AuctionFactory';
import { ShadowCard } from '@/components/common/shadow-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { addresses } from '@/constants/addresses';
import { getShadowCardBg, getShadowCardVariant } from '@/lib/shadow-card-variant';
import { cn } from '@/lib/utils';
import { useChainId, useReadContract } from 'wagmi';

export default function Home() {
  const chainId = useChainId();

  const { data } = useReadContract({
    abi: AUctionFactoryAbi,
    functionName: 'auctions',
    address: addresses[chainId].auctionFactory,
  });

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2 lg:gap-4 text-center">
        <h1 className="text-4xl font-medium">Welcome to Know Your Donation!</h1>
        <p className="px-4 lg:px-12 xl:px-16">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tenetur perspiciatis sit saepe ex earum soluta,
          repellat voluptatem doloremque cupiditate veritatis id? Magnam consectetur expedita repellat soluta. Eius
          praesentium est error.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-medium">Top active auctions</h2>
        <div className="w-full grid grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <ShadowCard variant={getShadowCardVariant(i)}>
              <CardHeader>
                <CardTitle className={cn(getShadowCardBg(i), 'rounded-[16px] py-2 text-center')}>
                  #NAME# Auction
                </CardTitle>
                <CardDescription className="text-slate-800">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut tempora consectetur distinctio hic totam
                  ex tempore?
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <img src="https://placehold.co/600x400" alt="" />
              </CardContent>
              <CardFooter className="flex justify-end my-4 py-0">
                <Button className="w-full">Participate</Button>
              </CardFooter>
            </ShadowCard>
          ))}
        </div>
      </div>
    </div>
  );
}
