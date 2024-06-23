import { erc721ABI } from '@/abi/erc721ABI';
import { httpClient } from '@/api/client';
import { ShadowCard } from '@/components/common/shadow-card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { GET_NFT_URI } from '@/graph/queries/get-user-nfts';
import { GetNftUriResponse } from '@/graph/queries/get-user-nfts-data';
import { useDefaultSubgraphQuery } from '@/hooks/useDefaultSubgraphQuery';
import useModalsStore from '@/store/modals-store';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { redirect, useParams } from 'react-router-dom';
import { getAddress } from 'viem';
import { useBlockNumber, useChainId, useReadContract } from 'wagmi';

interface NftMetadata {
  description: string;
  imageUrl: string;
}

export default function Nft() {
  const { address: nftAddress, tokenId } = useParams();

  const chainId = useChainId();

  if (!nftAddress || !tokenId) {
    redirect('/');
  }

  const { data: isBurnt, queryKey } = useReadContract({
    abi: erc721ABI,
    address: getAddress(nftAddress!),
    functionName: 'isBurnt',
    args: [BigInt(tokenId!)],
  });

  const { data: blockNumber } = useBlockNumber({ watch: true, chainId });
  const queryClient = useQueryClient();

  useEffect(() => {
    if (blockNumber) {
      queryClient.invalidateQueries({ queryKey });
    }
  }, [blockNumber, queryClient, queryKey]);

  const [nftData, setNftData] = useState<NftMetadata | null>(null);
  const [isAlertOpen, setAlertOpen] = useState(false);

  const { data: nftUriData } = useDefaultSubgraphQuery<GetNftUriResponse>(GET_NFT_URI, {
    variables: { address: nftAddress },
  });

  const { setNftAlertModalOpen, setDialogNftData } = useModalsStore();

  useEffect(() => {
    setDialogNftData({ nftAddress, tokenId });
  }, [nftAddress, setDialogNftData, tokenId]);

  useEffect(() => {
    (async () => {
      const rawNftData = nftUriData?.auctionNFTCreateds.find((created) => created.address === nftAddress);
      const response = await httpClient.get<NftMetadata>(`${rawNftData?.uri}${tokenId}`);
      setNftData(response.data);
    })();
  }, [nftAddress, nftUriData?.auctionNFTCreateds, tokenId]);

  // const handleRedeemNFT = async () => {
  //   await writeContractAsync({
  //     abi: erc721ABI,
  //     address: nftAddress as Address,
  //     functionName: 'burn',
  //     args: [BigInt(tokenId ?? 0), zeroAddress],
  //   });
  // };

  const handleClick = () => {
    // handleRedeemNFT();
    setNftAlertModalOpen(true);
  };

  // if (isLoading) {
  //   return (
  //     <div className="flex w-full justify-center">
  //       <Spinner />
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col gap-8">
      <Dialog open={isAlertOpen} onOpenChange={setAlertOpen}>
        <DialogContent>
          <div className="flex items-center justify-center"></div>
        </DialogContent>
      </Dialog>
      <div className="flex justify-center">
        <ShadowCard variant={'blue'} className="overflow-hidden">
          <img src={nftData?.imageUrl} alt="" className="rounded-[16px] w-full max-w-[600px] " />
        </ShadowCard>
      </div>
      <h1 className="text-4xl text-center font-semibold">{nftData?.description}</h1>

      <Button onClick={handleClick} className="py-3 text-[18px]" disabled={isBurnt}>
        Redeem
      </Button>
    </div>
  );
}
