import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShadowCard } from '../common/shadow-card';
import { getShadowCardFilledVariant } from '@/lib/shadow-card-variant';
import { useDefaultSubgraphQuery } from '@/hooks/useDefaultSubgraphQuery';
import { GET_USER_NFTS, GetUserNftsResponse, GET_NFT_URI, GetNftUriResponse } from '@/graph/queries/get-user-nfts';
import { useAccount } from 'wagmi';
import { httpClient } from '@/api/client';
import { routes } from '@/router';
import { useUserNftsData } from '@/hooks/queries/use-user-nfts-data';

interface NftMetadata {
  description: string;
  imageUrl: string;
}

export const ProfileNfts: React.FC = () => {
  const navigate = useNavigate();
  const { address } = useAccount();

  const {} = useUserNftsData();

  const { data: userNftsData, loading: isLoadingUserNfts } = useDefaultSubgraphQuery<GetUserNftsResponse>(
    GET_USER_NFTS,
    { owner: address }
  );

  const [nftData, setNftData] = useState<{ [key: string]: NftMetadata }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNftData = async () => {
      if (!userNftsData?.auctionNFTs) return;

      setLoading(true);
      const fetchedNftData: { [key: string]: NftMetadata } = {};

      try {
        await Promise.all(
          userNftsData.auctionNFTs.map(async (nft) => {
            try {
              const { data: nftUriData } = await httpClient.post<GetNftUriResponse>('/graphql', {
                query: GET_NFT_URI,
                variables: { address: nft.address },
              });

              const nftUri = nftUriData?.auctionNFTCreateds.find((created) => created.address === nft.address)?.uri;

              if (nftUri) {
                const response = await httpClient.get<NftMetadata>(`${nftUri}0`);
                if (response.data) {
                  fetchedNftData[nft.id] = response.data;
                } else {
                  console.error(`Failed to fetch data for NFT ${nft.id}: ${response.statusText}`);
                }
              } else {
                console.error(`Failed to fetch URI for NFT ${nft.id}`);
              }
            } catch (error) {
              console.error(`Error fetching data for NFT ${nft.id}:`, error);
            }
          })
        );

        setNftData(fetchedNftData);
      } catch (error) {
        console.error('Error fetching NFT data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNftData();
  }, [userNftsData]);

  const handleNftClick = useCallback(() => {
    navigate(routes.nft);
  }, [navigate]);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-3xl font-semibold">My NFTs</h2>
      {isLoadingUserNfts || loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-6">
          {userNftsData?.auctionNFTs?.length ? (
            userNftsData.auctionNFTs.map((nft, i) => (
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
      )}
    </div>
  );
};
