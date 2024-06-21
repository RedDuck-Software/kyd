import { viem } from 'hardhat';
import { expect } from 'chai';
import { encodePacked } from 'viem';

export const mint = async (
  auctionNft: any,
  caller: Awaited<ReturnType<typeof viem.getWalletClient>>,
  to: string,
  id: bigint,
  overrides?: {
    reverted?: boolean;
  },
) => {
  if (overrides?.reverted) {
    await expect(
      auctionNft.write.mint([to, id], {
        account: caller.account,
      }),
    ).to.be.rejected;

    return;
  }

  await auctionNft.write.mint([to, id], {
    account: caller.account,
  });

  expect(await auctionNft.read.id()).to.eq(id + 1n);
  expect((await auctionNft.read.ownerOf([id])).toLowerCase()).to.eq(
    to.toLowerCase(),
  );
};

export const burn = async (
  auctionNft: any,
  caller: Awaited<ReturnType<typeof viem.getWalletClient>>,
  id: bigint,
  overrides?: {
    reverted?: boolean;
  },
) => {
  if (overrides?.reverted) {
    await expect(
      auctionNft.write.burn([id], {
        account: caller.account,
      }),
    ).to.be.rejected;

    return;
  }

  await auctionNft.write.burn([id, encodePacked(['uint256'], [0n])], {
    account: caller.account,
  });

  expect(await auctionNft.read.id()).to.eq(id + 1n);
  expect((await auctionNft.read.ownerOf([id])).toLowerCase()).to.eq(
    caller.account.address.toLowerCase(),
  );
  expect(await auctionNft.read.isBurnt([id])).to.eq(true);
};
