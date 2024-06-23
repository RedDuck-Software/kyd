import { useQuery } from '@tanstack/react-query';

import { getAllAuctions } from '@/graph/queries/get-all-auctions';

export const useAllAuctions = () => {
  return useQuery({
    queryKey: ['auctions'],
    queryFn: async () => {
      return await getAllAuctions();
    },
  });
};
