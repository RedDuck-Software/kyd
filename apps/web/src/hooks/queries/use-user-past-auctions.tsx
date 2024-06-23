import { useQuery } from '@tanstack/react-query';

import { useAccount, useClient, useConfig } from 'wagmi';
import { getUserPastAuctions } from '@/graph/queries/get-user-past-auctions';
import { getUserAuctions } from '@/graph/queries/get-user-auctions';
import { publicActions } from 'viem';

export const useUserPastAuctions = () => {
  const { address } = useAccount();
  const client = useClient();
  const config = useConfig();
  return useQuery({
    queryKey: ['profile', 'stats', address],
    enabled: !!address,
    queryFn: async () => {
      const client = await config.getClient().extend(publicActions);
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
