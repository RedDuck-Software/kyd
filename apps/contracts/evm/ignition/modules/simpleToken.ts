import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const name = 'Tether';
const symbol = 'USDT';
const initSupply = 10000000;

const MockedTether = buildModule('MockedUsdt', (m) => {
  const nam = m.getParameter('name', name);
  const sym = m.getParameter('symbol', symbol);
  const init = m.getParameter('initSupply', initSupply);
  const dec = m.getParameter('decimal', 18);

  const tether = m.contract('Tether', [nam, sym, init, dec]);

  return { tether };
});

export default MockedTether;
