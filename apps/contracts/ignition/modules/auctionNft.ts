import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import { artifacts } from 'hardhat';

const NAME = 'AuctionNFTTester';

const AuctionNFTModule = buildModule(NAME, (m) => {
  const auctionNft = m.contract(NAME, artifacts.readArtifactSync(NAME));

  return { auctionNft };
});

export default AuctionNFTModule;
