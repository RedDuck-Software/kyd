import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
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
          {Array.from({ length: 3 }).map(() => (
            <Card>
              <CardHeader>
                <CardTitle className="text-slate-900">#NAME# Auction</CardTitle>
                <CardDescription className="text-slate-800">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut tempora consectetur distinctio hic totam
                  ex tempore?
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <img src="https://placehold.co/600x400" alt="" />
              </CardContent>
              <CardFooter className="flex justify-end my-4 py-0">
                <Button>Participate</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
