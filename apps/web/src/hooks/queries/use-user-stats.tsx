import { useQuery } from '@tanstack/react-query';

import { useAccount } from 'wagmi';
import { getUserPastAuctions } from '@/graph/queries/get-user-past-auctions';


export const useGetUserStats = () => {
  const { address } = useAccount();

  return useQuery({
    queryKey: ['profile', 'stats', address],
    enabled: !!address,
    queryFn: async () => {
      return await getUserPastAuctions(address!)
    },
  });
};
