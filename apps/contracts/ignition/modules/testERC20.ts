import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import { artifacts } from 'hardhat';

const NAME = 'ERC20Test';

const ERC20TestModule = buildModule(NAME, (m) => {
  const erc20Test = m.contract(NAME, artifacts.readArtifactSync(NAME));

  return { erc20Test };
});

export default ERC20TestModule;
