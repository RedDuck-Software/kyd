import { getShadowCardFilledVariant } from '@/lib/shadow-card-variant';
import { ShadowCard } from '../common/shadow-card';

export const TrandingAuctions = () => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[32px] font-semibold">Trending auctions</h2>
      <div className="grid grid-cols-1 gap-x-20 gap-y-6 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <button>
            <ShadowCard variant={'dark'} className="flex items-center p-3 rounded-[12px] justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[18px]">{i + 1}.</span>
                <img
                  src="https://forklog.com.ua/wp-content/uploads/2023/08/Snimok-ekrana-2023-08-23-v-12.14.48.webp"
                  alt=""
                  className="w-24"
                />
                <p className="font-semibold text-[20px]">FPV MONKEY</p>
              </div>
              <p className="text-[16px] font-medium">
                <span className="text-blue">5000USD</span> / <span className="text-violent">10000USD</span>
              </p>
            </ShadowCard>
          </button>
        ))}
      </div>
    </div>
  );
};
