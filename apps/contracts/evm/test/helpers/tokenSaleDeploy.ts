import { ignition, viem } from 'hardhat';
import { testDeployConstants } from '../common/constants';
import {
  impersonateAccount,
  setBalance,
} from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import { parseEther, getContract, erc20Abi } from 'viem';
import TokenSaleModule from '@/ignition/modules/tokenSale';
import MockedTether from '@/ignition/modules/simpleToken';

export async function deployEthTokenSale(deployMockedUsdt = false) {
  const [owner, user] = await viem.getWalletClients();

  await impersonateAccount(testDeployConstants.usdtHolderAddress);

  const usdtHolder = await viem.getWalletClient(
    testDeployConstants.usdtHolderAddress,
  );

  await setBalance(usdtHolder.account.address, parseEther('10'));

  const { tether } = await ignition.deploy(MockedTether, {
    defaultSender: owner.account.address,
  });
  const { tokenSale } = await ignition.deploy(TokenSaleModule, {
    defaultSender: owner.account.address,
  });

  await tokenSale.write.initialize([
    owner.account.address,
    testDeployConstants.ethUsdPriceFeed,
    testDeployConstants.usdtUsdPriceFeed,
    deployMockedUsdt ? tether.address : testDeployConstants.usdtAddress,
    testDeployConstants.minUsdThreshold,
  ]);

  await tokenSale.write.newRound([
    testDeployConstants.firstRoundPrice,
    BigInt(testDeployConstants.roundEndTime),
    BigInt(testDeployConstants.maxTokensToSell),
  ]);

  const publicClient = await viem.getPublicClient();

  const usdtToken = await getContract({
    address: testDeployConstants.usdtAddress,
    abi: erc20Abi,
    client: publicClient,
  });

  return {
    tokenSale,
    usdtToken,
    owner,
    user,
    usdtHolder,
    publicClient,
    tether,
    ...testDeployConstants,
  };
}

export async function deployWithMocked() {
  return deployEthTokenSale(true);
}
