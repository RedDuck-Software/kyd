import { getImplementationAddress } from '@openzeppelin/upgrades-core';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function delayMinutes(minutes: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(
      () => {
        resolve();
      },
      minutes * 60 * 1000,
    );
  });
}

export const getImplAddressFromProxy = async (
  hre: HardhatRuntimeEnvironment,
  proxyAddress: string,
): Promise<string> =>
  await getImplementationAddress(hre.network.provider, proxyAddress);

export const logDeploy = (
  contractName: string,
  contractType: string | undefined,
  address: string,
) =>
  console.info(
    `\x1b[32m${contractName}\x1b[0m${contractType ? ' ' : ''}${
      contractType ?? ''
    }:\t`,
    '\x1b[36m',
    address,
    '\x1b[0m',
  );

export const etherscanVerify = async (
  hre: HardhatRuntimeEnvironment,
  contractAddress: string,
  contract: string,
  ...constructorArguments: unknown[]
) => {
  const network = hre.network.name;
  if (network === 'localhost' || network === 'hardhat') return;
  await verify(hre, contractAddress, contract, ...constructorArguments);
};

export const etherscanVerifyImplementation = async (
  hre: HardhatRuntimeEnvironment,
  proxyAddress: string,
  contract: string,
  ...constructorArguments: unknown[]
) => {
  const contractAddress = await getImplAddressFromProxy(hre, proxyAddress);
  return etherscanVerify(
    hre,
    contractAddress,
    contract,
    ...constructorArguments,
  );
};

export const logDeployProxy = async (
  hre: HardhatRuntimeEnvironment,
  contractName: string,
  address: string,
) => {
  logDeploy(contractName, 'Proxy', address);

  try {
    logDeploy(
      contractName,
      'Impl',
      await getImplAddressFromProxy(hre, address),
    );
  } catch (err) {
    console.error('Log impl error. ', err);
  }
};

export const tryEtherscanVerifyImplementation = async (
  hre: HardhatRuntimeEnvironment,
  proxyAddress: string,
  contract: string,
  ...constructorArguments: unknown[]
) => {
  return await etherscanVerifyImplementation(
    hre,
    proxyAddress,
    contract,
    ...constructorArguments,
  )
    .catch((err) => {
      console.error('Unable to verify. Error: ', err);
      return false;
    })
    .then(() => {
      return true;
    });
};

export const verify = async (
  hre: HardhatRuntimeEnvironment,
  contractAddress: string,
  contract: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...constructorArguments: any[]
) => {
  console.log('Arguments: ', constructorArguments);

  await hre.run('verify:verify', {
    address: contractAddress,
    constructorArguments,
    contract,
  });
};
