import { CreateAuctionForm } from '@/components/create-auction-form/create-auction-form';

export default function CreateAuction() {
  return (
    <div className="flex-1 flex flex-col gap-8">
      <h1 className="text-4xl text-center font-semibold">Create new auction</h1>
      <div>
        <CreateAuctionForm />
      </div>
    </div>
  );
}
