import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import { artifacts } from 'hardhat';

const NAME = 'AuctionNFT1155';

const AuctionNFT1155Module = buildModule(NAME, (m) => {
  const auctionNft1155 = m.contract(NAME, artifacts.readArtifactSync(NAME));

  return { auctionNft1155 };
});

export default AuctionNFT1155Module;
