import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import { artifacts } from 'hardhat';

const NAME = 'AuctionFactoryTester';

const AuctionFactoryModule = buildModule(NAME, (m) => {
  const gelatoOperator  = m.getParameter('gelatoOperator');

  const auction = m.contract('Auction', artifacts.readArtifactSync('Auction'));
  const nft1155 = m.contract('AuctionNFT1155', artifacts.readArtifactSync('AuctionNFT1155'));
  const nft = m.contract('AuctionNFT', artifacts.readArtifactSync('AuctionNFT'));
  const auctionFactory = m.contract(NAME, artifacts.readArtifactSync(NAME), [
    gelatoOperator, 
    auction,
    nft,
    nft1155
  ]);

  return { auctionFactory };
});

export default AuctionFactoryModule;
