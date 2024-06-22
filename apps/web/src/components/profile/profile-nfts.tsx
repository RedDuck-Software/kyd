import { routes } from '@/router';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShadowCard } from '../common/shadow-card';
import { getShadowCardFilledVariant } from '@/lib/shadow-card-variant';
import { useGetUserNFTs } from '@/hooks/queries/use-user-nfts';

export const ProfileNfts = () => {
  const { data: userNftsRes } = useGetUserNFTs();
  const navigate = useNavigate();

  const handleNftClick = useCallback(() => {
    navigate(routes.nft);
  }, [navigate]);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[32px] font-semibold">My NFTs</h2>
      <div className="grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-6">
        {userNftsRes?.map((nft, i) => (
          <button onClick={handleNftClick} className="">
            <ShadowCard
              variant={getShadowCardFilledVariant(i)}
              className="flex flex-col overflow-hidden items-center gap-2"
            >
              <img src={nft.img} alt="" className="rounded-[16px]" />
              <h6 className="text-[18px] font-medium">{nft.name}</h6>
              <p>{nft.description}</p>
            </ShadowCard>
          </button>
        ))}
      </div>
    </div>
  );
};
