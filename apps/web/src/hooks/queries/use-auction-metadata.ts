import { useQuery } from '@tanstack/react-query';

import { httpClient } from '@/api/client';
import { getAuctionUri } from '@/graph/queries/get-auction-uri';
import { AuctionMetadata } from '@/pages/home';

export const useAuctionMetadata = (address: string, chainId: number) => {
  return useQuery({
    queryKey: ['auction-metadata'],
    queryFn: async () => {
      const uri = await getAuctionUri(address, chainId);
      return await httpClient.get<AuctionMetadata>(`${uri}0`);
    },
  });
};
