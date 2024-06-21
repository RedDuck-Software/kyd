import { generateBlockies } from '@/lib/blockies';
import { shortenAddress } from '@/lib/utils';
import { formatUnits } from 'viem';
import { useAccount, useBalance } from 'wagmi';

export const ProfileInfo = () => {
  const { address } = useAccount();
  const { data: balanceData } = useBalance({ address });

  return (
    <div className="flex gap-4 max-lg:flex-col">
      <div className="rounded-[16px] w-full border border-primary p-6 gap-4 flex ">
        {generateBlockies(address, 30, false)}
        <div className="flex flex-col gap-2">
          <p className="text-[18px] font-medium">{shortenAddress(address ?? '', 6)}</p>
          <p className="text-[16px]">
            {parseFloat(formatUnits(balanceData?.value ?? BigInt(0), balanceData?.decimals ?? 18)).toFixed(4)}{' '}
            {balanceData?.symbol}
          </p>
        </div>
      </div>
      <div className="rounded-[16px] w-full border border-primary p-6 gap-2 flex flex-col">
        <div className="flex items-center gap-3">
          <p className="text-[16px] ">Total USD donated:</p>
          <p className="text-[16px] font-medium">500$</p>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-[16px] ">Total auctions participated:</p>
          <p className="text-[16px] font-medium">10</p>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-[16px]">Auctions won:</p>
          <p className="text-[16px] font-medium">5</p>
        </div>
      </div>
    </div>
  );
};
