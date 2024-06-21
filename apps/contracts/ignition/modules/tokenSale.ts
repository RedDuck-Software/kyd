import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import { artifacts } from 'hardhat';

const NAME = 'TokenSaleTester';

const TokenSaleModule = buildModule(NAME, (m) => {
  const adminAddress = m.getParameter('adminAddress');
  const ethUsdPriceFeed = m.getParameter('ethUsdPriceFeed');
  const usdtUsdPriceFeed = m.getParameter('usdtUsdPriceFeed');
  const usdtAddress = m.getParameter('usdtAddress');
  const minUsdThreshold = m.getParameter('minUsdThreshold');
  const maxTokensToSell = m.getParameter('maxTokensToSell');
  const usdtDecimals = m.getParameter('usdtDecimals');

  const tokenSale = m.contract(NAME, artifacts.readArtifactSync(NAME));

  return { tokenSale };
});

export default TokenSaleModule;
