import { useQuery } from '@tanstack/react-query';

import { useAccount } from 'wagmi';
import { NFT } from '@/graph/queries/get-user-nfts';

const config: NFT[] = [
  {
    img: 'https://forklog.com.ua/wp-content/uploads/2023/08/Snimok-ekrana-2023-08-23-v-12.14.48.webp',
    name: 'BAYC #4545',
    description: 'DEscrtioption very long very boring a;sdkasjdlaskjdasjdasjd',
  },
  {
    img: 'https://forklog.com.ua/wp-content/uploads/2023/08/Snimok-ekrana-2023-08-23-v-12.14.48.webp',
    name: 'BAYC #4545',
    description: 'DEscrtioption very long very boring a;sdkasjdlaskjdasjdasjd',
  },
  {
    img: 'https://forklog.com.ua/wp-content/uploads/2023/08/Snimok-ekrana-2023-08-23-v-12.14.48.webp',
    name: 'BAYC #4545',
    description: 'DEscrtioption very long very boring a;sdkasjdlaskjdasjdasjd',
  },
];

export const useGetUserNFTs = () => {
  const { address } = useAccount();

  return useQuery<NFT[]>({
    queryKey: ['profile', 'nfts', address],
    enabled: Boolean(address),
    queryFn: async () => {
      return config;
    },
  });
};
