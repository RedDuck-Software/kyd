import AuctionNFTModule from '@/ignition/modules/auctionNft';
import { ignition, viem } from 'hardhat';

export async function deployAuctionNft() {
  const [owner] = await viem.getWalletClients();

  const { auctionNft } = await ignition.deploy(AuctionNFTModule, {
    defaultSender: owner.account.address,
  });

  await auctionNft.write.initialize(['TEST', 'T']);

  return {
    auctionNft,
    owner,
  };
}
