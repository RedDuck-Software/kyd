import { routes } from '@/router';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../ui/badge';

export const ProfilePastAuctions = () => {
  const navigate = useNavigate();

  const handleNftClick = useCallback(() => {
    navigate(routes.nft);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[20px] font-semibold">Past auctions</h2>
      <div className="flex flex-col gap-4">
        <button onClick={handleNftClick} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="https://forklog.com.ua/wp-content/uploads/2023/08/Snimok-ekrana-2023-08-23-v-12.14.48.webp"
              alt=""
              className="rounded-[16px] h-[70px]"
            />
            <h6 className="text-[18px] font-medium">BAYC 4</h6>
          </div>
          <Badge variant="success" className="py-2 text-[14px]">
            You've got something!
          </Badge>
        </button>
        <button onClick={handleNftClick} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="https://forklog.com.ua/wp-content/uploads/2023/08/Snimok-ekrana-2023-08-23-v-12.14.48.webp"
              alt=""
              className="rounded-[16px] h-[70px]"
            />
            <h6 className="text-[18px] font-medium">BAYC 4</h6>
          </div>
          <Badge variant="default" className="py-2 text-[14px]">
            Thanks for your impact!
          </Badge>
        </button>
      </div>
    </div>
  );
};
