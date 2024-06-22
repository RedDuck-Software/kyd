import { useQuery } from '@tanstack/react-query';

import { useAccount } from 'wagmi';
import { UserInfo } from '@/graph/queries/get-user-stats';

const data = {
  totalParticipated: 5,
  usdDonated: 200,
  won: 6,
} as UserInfo;

export const useGetUserStats = () => {
  const { address } = useAccount();

  return useQuery({
    queryKey: ['profile', 'stats', address],
    enabled: Boolean(address),
    queryFn: async () => {
      return data;
      // return await getUserStats(address!);
    },
  });
};
