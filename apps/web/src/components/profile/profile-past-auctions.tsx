import { routes } from '@/router';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../ui/badge';
import { ShadowCard } from '../common/shadow-card';

const config = [
  {
    image: 'https://forklog.com.ua/wp-content/uploads/2023/08/Snimok-ekrana-2023-08-23-v-12.14.48.webp',
    name: 'BAYC 4',
    isWon: true,
  },
  {
    image: 'https://forklog.com.ua/wp-content/uploads/2023/08/Snimok-ekrana-2023-08-23-v-12.14.48.webp',
    name: 'BAYC 4',
    isWon: false,
  },
];

export const ProfilePastAuctions = () => {
  const navigate = useNavigate();

  const handleNftClick = useCallback(() => {
    navigate(routes.nft);
  }, [navigate]);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[32px] font-semibold">Past auctions</h2>
      <div className="flex flex-col gap-4">
        {config.map((auction) => (
          <button onClick={handleNftClick}>
            <ShadowCard variant={'dark'} className="flex p-3 rounded-[20px] items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={auction.image} alt="" className="rounded-[16px] h-[70px]" />
                <h6 className="text-[18px] font-medium">{auction.name}</h6>
              </div>
              <Badge variant={auction.isWon ? 'success' : 'default'} className="py-2 text-dark text-[14px]">
                {auction.isWon ? "You've got something!" : 'Thanks for participating!'}
              </Badge>
            </ShadowCard>
          </button>
        ))}
      </div>
    </div>
  );
};
