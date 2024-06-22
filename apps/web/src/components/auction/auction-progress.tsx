import { Progress } from '../ui/progress';

export const AuctionProgress = () => {
  const progress = 50;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-between">
        <h2 className="text-[32px] font-semibold">Progress</h2>
        <p className="text-[16px] font-medium">{progress.toFixed(2)}%</p>
      </div>

      <div className="flex flex-col gap-6">
        <Progress className="border-dark border bg-light" value={progress} />
      </div>
      <div className="flex items-start justify-between">
        <p className="text-[18px] font-medium">
          Already raised: <span className="text-blue">{50000}$</span>
        </p>
        <p className="text-[18px] font-medium">
          Raise goal:<span className="text-violent"> {100000}$</span>
        </p>
      </div>
    </div>
  );
};
