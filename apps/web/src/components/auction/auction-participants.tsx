import { getShadowCardBg, getShadowCardFilledVariant, getShadowCardText } from '@/lib/shadow-card-variant';
import { ShadowCard } from '../common/shadow-card';
import { generateBlockies } from '@/lib/blockies';
import { shortenAddress } from '@/lib/utils';
import { cn } from '../../lib/utils';

export const AuctionParticipants = () => {
  const participants = [
    {
      address: '0x6E2F1d7eE2Aa23007448810bd21BbCccE07fF21c',
      usdDonated: 800,
    },
    {
      address: '0x6E2F1d7eE2Aa23007448810bd21BbCccE07fF21c',
      usdDonated: 800,
    },
    {
      address: '0x6E2F1d7eE2Aa23007448810bd21BbCccE07fF21c',
      usdDonated: 800,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[32px] font-semibold">Donaters</h2>
      <div className="flex flex-col gap-6">
        {participants?.map((participant, i) => (
          <ShadowCard
            key={participant.address}
            variant={getShadowCardFilledVariant(i)}
            className="flex justify-between p-2 overflow-hidden items-center"
          >
            <div className="flex items-center gap-4">
              {generateBlockies(participant.address as `0x${string}`, 25)}
              <h6 className="text-[18px] font-medium">{shortenAddress(participant.address ?? '', 6)}</h6>
            </div>
            <p className={cn(getShadowCardText(i), ' text-[18px] font-bold')}>{participant.usdDonated.toFixed(2)}$</p>
          </ShadowCard>
        ))}
      </div>
    </div>
  );
};
