import { generateBlockies } from '@/lib/blockies';
import { shortenAddress } from '@/lib/utils';
import { formatUnits } from 'viem';
import { useAccount, useBalance } from 'wagmi';
import { ShadowCard } from '../common/shadow-card';
import { useGetUserStats } from '@/hooks/queries/use-user-stats';

export const ProfileInfo = () => {
  const { address } = useAccount();
  const { data: balanceData } = useBalance({ address });

  const { data: userStats } = useGetUserStats();

  return (
    <div className="flex gap-8 lg:gap-16 max-lg:flex-col">
      <ShadowCard className=" w-full  p-6 gap-4 flex ">
        {generateBlockies(address, 30)}
        <div className="flex flex-col gap-2">
          <p className="text-[18px] font-medium">{shortenAddress(address ?? '', 6)}</p>
          <p className="text-[16px]">
            {parseFloat(formatUnits(balanceData?.value ?? BigInt(0), balanceData?.decimals ?? 18)).toFixed(4)}{' '}
            {balanceData?.symbol}
          </p>
        </div>
      </ShadowCard>
      <ShadowCard variant="blue" className=" w-full p-6 gap-2 flex flex-col">
        <div className="flex items-center gap-3">
          <p className="text-[16px] ">Total USD donated:</p>
          <p className="text-[16px] font-medium">{userStats?.usdDonated?.toFixed?.(4) ?? 0}$</p>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-[16px] ">Total auctions participated:</p>
          <p className="text-[16px] font-medium">{userStats?.totalParticipated ?? 0}</p>
        </div>
      </ShadowCard>
    </div>
  );
};
