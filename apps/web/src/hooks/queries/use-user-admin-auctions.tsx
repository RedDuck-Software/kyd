import { getUserAdminAuctions } from '@/graph/queries/get-user-admin-auctions';
import { useQuery } from '@tanstack/react-query';

import { useAccount } from 'wagmi';

export const useUserAdminAuctions = () => {
  const { address } = useAccount();

  return useQuery({
    queryKey: ['user-admin-auctions'],
    enabled: !!address,
    queryFn: async () => {
      return await getUserAdminAuctions(address!);
    },
  });
};
