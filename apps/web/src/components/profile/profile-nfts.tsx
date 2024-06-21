import { routes } from '@/router';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const ProfileNfts = () => {
  const navigate = useNavigate();

  const handleNftClick = useCallback(() => {
    navigate(routes.nft);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[20px] font-semibold">My NFTs</h2>
      <div className="grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-6">
        <button onClick={handleNftClick} className="flex flex-col items-center gap-2">
          <img
            src="https://forklog.com.ua/wp-content/uploads/2023/08/Snimok-ekrana-2023-08-23-v-12.14.48.webp"
            alt=""
            className="rounded-[16px]"
          />
          <h6 className="text-[18px] font-medium">BAYC 4</h6>
          <p>DEscrtioption very long very boring a;sdkasjdlaskjdasjdasjd</p>
        </button>
      </div>
    </div>
  );
};
