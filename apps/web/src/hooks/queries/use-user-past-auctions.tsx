import { useQuery } from '@tanstack/react-query';

import { useAccount } from 'wagmi';
import { getUserAuctions } from '@/graph/queries/get-user-auctions';

export const useUserPastAuctions = () => {
  const { address } = useAccount();
  return useQuery({
    queryKey: ['profile', 'stats', address],
    enabled: !!address,
    queryFn: async () => {
      const auctions = await getUserAuctions(address!);

      console.log({ auctions });
      return auctions;
      // const allMetadatas = client.multicall({
      //   contracts: auctions.map(a=>({
      //     abi: auctionAbi
      //   })),
      // })
    },
  });
};
