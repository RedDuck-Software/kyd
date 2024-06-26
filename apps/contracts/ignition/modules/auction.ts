import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import { artifacts } from 'hardhat';

const NAME = 'Auction';

const AuctionModule = buildModule(NAME, (m) => {
  const auction = m.contract(NAME, artifacts.readArtifactSync(NAME));

  return { auction };
});

export default AuctionModule;
