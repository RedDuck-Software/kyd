import { routes } from '@/router';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShadowCard } from '../common/shadow-card';
import { getShadowCardFilledVariant } from '@/lib/shadow-card-variant';
import { useDefaultSubgraphQuery } from '@/hooks/useDefaultSubgraphQuery';
import { GET_USER_NFTS, GetUserNftsResponse } from '@/graph/queries/get-user-nfts';
import { useAccount } from 'wagmi';
import { httpClient } from '@/api/client';

interface NftMetadata {
  description: string;
  imageUrl: string;
}

export const ProfileNfts: React.FC = () => {
  const navigate = useNavigate();
  const { address } = useAccount();

  const { data } = useDefaultSubgraphQuery<GetUserNftsResponse>(GET_USER_NFTS, { owner: address });

  const [nftData, setNftData] = useState<{ [key: string]: NftMetadata }>({});

  useEffect(() => {
    const fetchNftData = async () => {
      const fetchedNftData: { [key: string]: NftMetadata } = {};

      if (!data?.auctionNFTs) return;

      await Promise.all(
        data.auctionNFTs.map(async (nft) => {
          try {
            const response = await httpClient.get<NftMetadata>(`${nft.uri}0`);
            if (response.data) {
              fetchedNftData[nft.id] = response.data;
            } else {
              console.error(`Failed to fetch data for NFT ${nft.id}: ${response.statusText}`);
            }
          } catch (error) {
            console.error(`Error fetching data for NFT ${nft.id}:`, error);
          }
        })
      );

      setNftData(fetchedNftData);
    };

    fetchNftData();
  }, [data?.auctionNFTs]);

  const handleNftClick = useCallback(() => {
    navigate(routes.nft);
  }, [navigate]);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[32px] font-semibold">My NFTs</h2>
      <div className="grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-6">
        {data?.auctionNFTs?.length ? (
          data.auctionNFTs.map((nft, i) => (
            <button key={nft.id} onClick={handleNftClick} className="">
              <ShadowCard
                variant={getShadowCardFilledVariant(i)}
                className="flex flex-col overflow-hidden items-center gap-2"
              >
                <img
                  src={nftData[nft.id]?.imageUrl}
                  alt={nftData[nft.id]?.description || ''}
                  className="rounded-[16px]"
                />
                <h6 className="text-[18px] font-medium">{nftData[nft.id]?.description}</h6>
              </ShadowCard>
            </button>
          ))
        ) : (
          <div>You don't have any NFTs :(</div>
        )}
      </div>
    </div>
  );
};
