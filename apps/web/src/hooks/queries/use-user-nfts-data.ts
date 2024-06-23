import { useQuery } from '@tanstack/react-query';

import { useAccount } from 'wagmi';
import { getUserNftsData } from '@/graph/queries/get-user-nfts-data';

export const useUserNftsData = () => {
  const { address } = useAccount();

  return useQuery({
    queryKey: ['user', 'nfts', address],
    enabled: Boolean(address),
    queryFn: async () => {
      return await getUserNftsData(address!);
    },
  });
};
