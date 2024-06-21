import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import { expect } from 'chai';
import { network, viem } from 'hardhat';
import {
  getAddress,
  parseEther,
  parseUnits,
  formatUnits,
  Address,
  parseEventLogs,
  decodeAbiParameters,
} from 'viem';
import {
  deployEthTokenSale,
  deployWithMocked,
} from './helpers/tokenSaleDeploy';
import { tokenSaleAbi } from './abi/tokenSaleAbi';
import { testDeployConstants } from './common/constants';

describe('Token sale', function () {
  const firstRoundPrice: bigint = parseEther('0.1');
  const roundEndTime = Date.now() + 604800;

  describe('Deployment', () => {
    it('Should deploy token sale smart contract', async () => {
      const { tokenSale } = await loadFixture(deployEthTokenSale);
      expect(tokenSale.address).to.not.equal(undefined);
    });

    it('Should set owner of contract to deployer address', async () => {
      const { tokenSale, owner } = await loadFixture(deployEthTokenSale);

      const contractOwner: Address = await tokenSale.read.owner();

      expect(contractOwner).to.equal(getAddress(owner.account.address));
    });

    it('Should set proper admin address', async () => {
      const { tokenSale, owner } = await loadFixture(deployEthTokenSale);

      const adminAddress: Address = await tokenSale.read.adminAddress();

      expect(adminAddress).to.equal(getAddress(owner.account.address));
    });

    it('Should proper set eth/usd price feed', async () => {
      const { tokenSale, ethUsdPriceFeed } =
        await loadFixture(deployEthTokenSale);

      const ethUsdDataFeed: Address = await tokenSale.read.ethUsdPriceFeed();

      expect(ethUsdDataFeed).to.equal(ethUsdPriceFeed);
    });

    it('Should proper set usdt/usd price feed', async () => {
      const { tokenSale, usdtUsdPriceFeed } =
        await loadFixture(deployEthTokenSale);

      const usdtUsdFeed: Address = await tokenSale.read.usdtUsdPriceFeed();

      expect(usdtUsdFeed).to.equal(usdtUsdPriceFeed);
    });

    it('Should proper set usdt address', async () => {
      const { tokenSale, usdtAddress } = await loadFixture(deployEthTokenSale);

      const usdtAddr: Address = await tokenSale.read.usdtAddress();

      expect(usdtAddr).to.equal(usdtAddress);
    });

    it('Should start first sale round', async () => {
      const { tokenSale } = await loadFixture(deployEthTokenSale);

      const afterDeploymentRound: bigint = await tokenSale.read.currentRound();

      expect(afterDeploymentRound).to.equal(1n);
    });

    it('Should set proper first round sale price', async () => {
      const { tokenSale } = await loadFixture(deployEthTokenSale);

      const roundPrice: bigint = await tokenSale.read.roundPrice([1n]);

      expect(roundPrice).to.equal(firstRoundPrice);
    });

    it('Should set min usd threshold', async () => {
      const { tokenSale } = await loadFixture(deployEthTokenSale);

      const contractMinUsdThreshold: bigint =
        await tokenSale.read.minUsdThreshold();

      expect(Number(formatUnits(contractMinUsdThreshold, 18))).to.equal(500);
    });

    it('Should set proper end round timestamp', async () => {
      const { tokenSale, roundEndTime } = await loadFixture(deployEthTokenSale);

      const currRoundEndTime = await tokenSale.read.currentRoundEndTime();

      expect(Number(currRoundEndTime)).to.equal(roundEndTime);
    });
  });

  describe('Management', () => {
    it('Should perform only by owner of contract', async () => {
      const { tokenSale, user } = await loadFixture(deployEthTokenSale);

      await expect(
        tokenSale.write.manageAdminAddress([user.account.address], {
          account: user.account,
        }),
      ).to.be.rejected;

      await expect(
        tokenSale.write.manageEthUsdPriceFeed([user.account.address], {
          account: user.account,
        }),
      ).to.be.rejected;

      await expect(
        tokenSale.write.manageUsdtUsdPriceFeed([user.account.address], {
          account: user.account,
        }),
      ).to.be.rejected;

      await expect(
        tokenSale.write.manageUsdtAddress([user.account.address], {
          account: user.account,
        }),
      ).to.be.rejected;

      await expect(
        tokenSale.write.newRound([BigInt(firstRoundPrice), 3600n, 100n], {
          account: user.account,
        }),
      ).to.be.rejected;

      await expect(
        tokenSale.write.stopRound({
          account: user.account,
        }),
      ).to.be.rejected;

      await expect(
        tokenSale.write.manageMinUsdThreshold([1n], {
          account: user.account,
        }),
      ).to.be.rejected;

      await expect(
        tokenSale.write.manageMaxTokenToSell([1n], {
          account: user.account,
        }),
      ).to.be.rejected;
    });

    it('Should manage admin address', async () => {
      const { tokenSale, user } = await loadFixture(deployEthTokenSale);

      await tokenSale.write.manageAdminAddress([user.account.address]);

      const newAdminAddress: Address = await tokenSale.read.adminAddress();

      expect(newAdminAddress).to.equal(getAddress(user.account.address));
    });

    it('Should manage eth/usd price feed', async () => {
      const { tokenSale, user } = await loadFixture(deployEthTokenSale);

      await tokenSale.write.manageEthUsdPriceFeed([user.account.address]);
      const newEthUsdPriceFeed: Address =
        await tokenSale.read.ethUsdPriceFeed();

      expect(newEthUsdPriceFeed).to.equal(getAddress(user.account.address));
    });

    it('Should manage usdt/usd price feed', async () => {
      const { tokenSale, user } = await loadFixture(deployEthTokenSale);

      await tokenSale.write.manageUsdtUsdPriceFeed([user.account.address]);
      const newUsdtUsdPriceFeed: Address =
        await tokenSale.read.usdtUsdPriceFeed();

      expect(newUsdtUsdPriceFeed).to.equal(getAddress(user.account.address));
    });

    it('Should manage usdt token address', async () => {
      const { tokenSale, user } = await loadFixture(deployEthTokenSale);

      await tokenSale.write.manageUsdtAddress([user.account.address]);
      const newUsdtTokenAddress: Address = await tokenSale.read.usdtAddress();

      expect(newUsdtTokenAddress).to.equal(getAddress(user.account.address));
    });

    it('Should start new sale round', async () => {
      const { tokenSale } = await loadFixture(deployEthTokenSale);

      const newRoundPrice: bigint = parseEther('0.15');

      const prevRound: bigint = await tokenSale.read.currentRound();

      await tokenSale.write.newRound([newRoundPrice, 3600n, 100n]);

      const currRound: bigint = await tokenSale.read.currentRound();

      expect(currRound).to.equal(prevRound + 1n);
    });

    it('Should set new price in new sale round', async () => {
      const { tokenSale } = await loadFixture(deployEthTokenSale);

      const newRoundPrice: bigint = parseEther('0.15');

      await tokenSale.write.newRound([newRoundPrice, 3600n, 100n]);

      const currRound: bigint = await tokenSale.read.currentRound();

      const currRoundPrice: bigint = await tokenSale.read.roundPrice([
        currRound,
      ]);

      expect(currRoundPrice).to.equal(newRoundPrice);
    });

    it('Should update round end time of new round', async () => {
      const { tokenSale } = await loadFixture(deployEthTokenSale);

      const newRoundPrice: bigint = parseEther('0.15');

      await tokenSale.write.newRound([
        newRoundPrice,
        BigInt(roundEndTime - 10),
        100n,
      ]);

      const newRoundEndTime: bigint =
        await tokenSale.read.currentRoundEndTime();

      expect(newRoundEndTime).to.be.equal(BigInt(roundEndTime - 10));
    });

    it('Should update max tokens to sell in a new round', async () => {
      const { tokenSale } = await loadFixture(deployEthTokenSale);

      const newRoundPrice: bigint = parseEther('0.15');

      await tokenSale.write.newRound([
        newRoundPrice,
        BigInt(roundEndTime - 10),
        100n,
      ]);

      const maxAmount: bigint = await tokenSale.read.maxTokenToSell();

      expect(maxAmount).to.be.equal(100n);
    });

    it('Should stop current round', async () => {
      const { tokenSale } = await loadFixture(deployEthTokenSale);

      let isInProgress: boolean = await tokenSale.read.isRoundInProgress([1n]);

      expect(isInProgress).to.be.equal(true);

      await tokenSale.write.stopRound();

      isInProgress = await tokenSale.read.isRoundInProgress([1n]);

      expect(isInProgress).to.be.equal(false);
    });

    it('Should not stop current round if it outdated', async () => {
      const { tokenSale } = await loadFixture(deployEthTokenSale);

      await network.provider.send('evm_increaseTime', [roundEndTime + 100]);
      await network.provider.send('evm_mine', []);

      await expect(tokenSale.write.stopRound()).to.be.rejectedWith(
        'RoundIsNotInProgress()',
      );
    });

    it('Should not stop current round if it already stopped', async () => {
      const { tokenSale } = await loadFixture(deployEthTokenSale);

      await tokenSale.write.stopRound();

      await expect(tokenSale.write.stopRound()).to.be.rejectedWith(
        'RoundIsNotInProgress()',
      );
    });

    it('Should manage min usd threshold', async () => {
      const { tokenSale } = await loadFixture(deployEthTokenSale);

      const newMinThreshold = parseUnits('200', 26);

      await tokenSale.write.manageMinUsdThreshold([newMinThreshold]);

      expect(await tokenSale.read.minUsdThreshold()).to.be.equal(
        newMinThreshold,
      );
    });

    it('Should manage max token to sell', async () => {
      const { tokenSale } = await loadFixture(deployEthTokenSale);

      const newMaxToken: bigint = parseUnits('200', 26);

      await tokenSale.write.manageMaxTokenToSell([newMaxToken]);

      expect(await tokenSale.read.maxTokenToSell()).to.equal(newMaxToken);
    });
  });

  describe('Currency', () => {
    it('Should get currency of eth/usd', async () => {
      const { tokenSale } = await loadFixture(deployEthTokenSale);

      const inContractFeed = await tokenSale.read.ethUsdPriceFeed();

      const currency = await tokenSale.read.getCurrency([inContractFeed]);

      expect(currency).to.not.equal(0);
    });

    it('Should get currency of usdt/usd', async () => {
      const { tokenSale } = await loadFixture(deployEthTokenSale);

      const inContractFeed = await tokenSale.read.usdtUsdPriceFeed();

      const currency = await tokenSale.read.getCurrency([inContractFeed]);

      expect(currency).to.not.equal(0);
    });
  });

  describe('Buy operations', () => {
    it('Should proper calculate token amount depend on eth amount', async () => {
      const { tokenSale, user } = await loadFixture(deployEthTokenSale);

      const ethAmount = parseEther('0.5');

      const dataFeed: Address = await tokenSale.read.ethUsdPriceFeed();

      const currency = await tokenSale.read.getCurrency([dataFeed]);

      //@ts-ignore
      await tokenSale.write.buyTokens([user.account.address, 'referrer'], {
        value: ethAmount,
      });

      const tokenUserBalance: bigint = await tokenSale.read.tokenBalances([
        user.account.address,
      ]);

      expect(tokenUserBalance).to.equal(
        (ethAmount * currency) / firstRoundPrice,
      );
    });

    it('Should proper calculate token amount depend on usdt amount', async () => {
      const { tokenSale, usdtToken, usdtHolder } =
        await loadFixture(deployEthTokenSale);

      const usdtAmount: bigint = parseUnits('7777', 18);

      await usdtToken.write.approve([tokenSale.address, usdtAmount], {
        account: usdtHolder.account,
      });

      const dataFeed: Address = await tokenSale.read.usdtUsdPriceFeed();

      const currency = await tokenSale.read.getCurrency([dataFeed]);

      await tokenSale.write.buyTokens(
        [usdtHolder.account.address, 'referrer', usdtAmount],
        {
          account: usdtHolder.account,
        },
      );

      const tokenUserBalance = await tokenSale.read.viewUserBalance([
        usdtHolder.account.address,
      ]);

      expect(tokenUserBalance).to.equal(
        (usdtAmount * currency) / firstRoundPrice,
      );
    });
    it('Should proper buy tokens with 18-decimal usdt', async () => {
      const { tokenSale, owner, tether } = await loadFixture(deployWithMocked);

      const usdtAmount: bigint = parseUnits('7777', 18);

      await tether.write.approve([tokenSale.address, usdtAmount], {
        account: owner.account,
      });

      const dataFeed: Address = await tokenSale.read.usdtUsdPriceFeed();

      const currency = await tokenSale.read.getCurrency([dataFeed]);

      await tokenSale.write.buyTokens(
        [owner.account.address, 'referrer', usdtAmount],
        {
          account: owner.account,
        },
      );

      const tokenUserBalance = await tokenSale.read.viewUserBalance([
        owner.account.address,
      ]);

      expect(tokenUserBalance).to.equal(
        (usdtAmount * currency) / firstRoundPrice,
      );
    });
    it('Should proper handle token balance when both eth and usdt transactions are made', async () => {
      const { tokenSale, usdtHolder, usdtToken, user } =
        await loadFixture(deployEthTokenSale);

      const usdtAmount: bigint = parseUnits('8787', 6);

      await usdtToken.write.transfer([user.account.address, usdtAmount], {
        account: usdtHolder.account,
      });

      await usdtToken.write.approve([tokenSale.address, usdtAmount], {
        account: user.account,
      });

      const dataFeedUsdt: Address = await tokenSale.read.usdtUsdPriceFeed();

      const currency = await tokenSale.read.getCurrency([dataFeedUsdt]);

      await tokenSale.write.buyTokens(
        [
          user.account.address,
          'referrer',
          parseUnits(usdtAmount.toString(), 12),
        ],
        {
          account: user.account,
        },
      );
      const ethAmount: bigint = parseEther('0.5');

      const dataFeedEth: Address = await tokenSale.read.ethUsdPriceFeed();

      const currencyEth = await tokenSale.read.getCurrency([dataFeedEth]);

      //@ts-ignore
      await tokenSale.write.buyTokens([user.account.address, 'referrer'], {
        account: user.account,
        value: ethAmount,
      });

      const tokenUserBalance: bigint = await tokenSale.read.tokenBalances([
        user.account.address,
      ]);

      const expectedUserBalance: bigint =
        (parseUnits(usdtAmount.toString(), 12) * currency) / firstRoundPrice +
        (ethAmount * currencyEth) / firstRoundPrice;

      expect(tokenUserBalance).to.equal(expectedUserBalance);
    });
    it('Should increase total usd amound after buy operations', async () => {
      const { tokenSale, usdtHolder, usdtToken, user } =
        await loadFixture(deployEthTokenSale);

      const usdtAmount: bigint = parseUnits('502', 6);

      await usdtToken.write.transfer([user.account.address, usdtAmount], {
        account: usdtHolder.account,
      });

      await usdtToken.write.approve([tokenSale.address, usdtAmount], {
        account: user.account,
      });

      const dataFeedUsdt: Address = await tokenSale.read.usdtUsdPriceFeed();

      const currencyUsdt = await tokenSale.read.getCurrency([dataFeedUsdt]);

      await tokenSale.write.buyTokens(
        [
          user.account.address,
          'referrer',
          parseUnits(usdtAmount.toString(), 12),
        ],
        {
          account: user.account,
        },
      );

      const secondRoundPrice: bigint = parseEther('0.2');

      await tokenSale.write.newRound([
        secondRoundPrice,
        BigInt(roundEndTime + 10),
        testDeployConstants.maxTokensToSell,
      ]);

      const ethAmount: bigint = parseEther('0.5');

      const dataFeedEth: Address = await tokenSale.read.ethUsdPriceFeed();

      const currencyEth = await tokenSale.read.getCurrency([dataFeedEth]);

      //@ts-ignore
      await tokenSale.write.buyTokens([user.account.address, 'referrer'], {
        account: user.account,
        value: ethAmount,
      });

      const totalUsdAmount: bigint = await tokenSale.read.totalTokenSold();

      const expectedTotalUsdAmount: bigint =
        (usdtAmount * parseUnits('1', 12) * currencyUsdt) / firstRoundPrice +
        (ethAmount * currencyEth) / secondRoundPrice;

      expect(totalUsdAmount).to.equal(expectedTotalUsdAmount);
    });
    it('Should proper increase total token amount after buy operation', async () => {
      const { tokenSale, usdtHolder, usdtToken, user, owner } =
        await loadFixture(deployEthTokenSale);

      const usdtAmount: bigint = parseUnits('502', 6);

      await usdtToken.write.transfer([user.account.address, usdtAmount], {
        account: usdtHolder.account,
      });

      await usdtToken.write.approve([tokenSale.address, usdtAmount], {
        account: user.account,
      });

      const dataFeedUsdt: Address = await tokenSale.read.usdtUsdPriceFeed();

      const currencyUsdt = await tokenSale.read.getCurrency([dataFeedUsdt]);

      await tokenSale.write.buyTokens(
        [
          user.account.address,
          'referrer',
          parseUnits(usdtAmount.toString(), 12),
        ],
        {
          account: user.account,
        },
      );

      const ethAmount: bigint = parseEther('0.5');

      const dataFeedEth: Address = await tokenSale.read.ethUsdPriceFeed();

      const currencyEth = await tokenSale.read.getCurrency([dataFeedEth]);

      //@ts-ignore
      await tokenSale.write.buyTokens([user.account.address, 'referrer'], {
        account: user.account,
        value: ethAmount,
      });

      const expectedTotalTokenAmount: bigint =
        (parseUnits(usdtAmount.toString(), 12) * currencyUsdt) /
          firstRoundPrice +
        (ethAmount * currencyEth) / firstRoundPrice;

      const totalTokenAmount: bigint = await tokenSale.read.totalTokenSold();

      expect(totalTokenAmount).to.equal(expectedTotalTokenAmount);
    });
    it('Should emit event and fields can be decoded', async () => {
      const { tokenSale, usdtHolder, usdtToken, user, owner } =
        await loadFixture(deployEthTokenSale);

      const usdtAmount: bigint = parseUnits('502', 6);

      await usdtToken.write.transfer([user.account.address, usdtAmount], {
        account: usdtHolder.account,
      });

      await usdtToken.write.approve([tokenSale.address, usdtAmount], {
        account: user.account,
      });

      const tx = await tokenSale.write.buyTokens(
        [
          user.account.address,
          'referer',
          parseUnits(usdtAmount.toString(), 12),
        ],
        {
          account: user.account,
        },
      );

      const client = await viem.getPublicClient();

      const txResult = await client.waitForTransactionReceipt({ hash: tx });

      const parsedLogs = parseEventLogs({
        abi: tokenSaleAbi,
        logs: txResult.logs,
        eventName: 'Buy',
      });

      const decodedReferrer = decodeAbiParameters(
        [{ name: 'referrer', type: 'string' }],
        parsedLogs[0].args.referrer,
      );

      expect(decodedReferrer[0]).to.be.equal('referer');
    });
  });
  describe('Preventing buy operations', () => {
    it('Should not allow to buy tokens with eth if current round is outdated', async () => {
      const { tokenSale, user } = await loadFixture(deployEthTokenSale);

      const ethAmount = parseEther('10');

      await network.provider.send('evm_increaseTime', [roundEndTime + 10]);
      await network.provider.send('evm_mine', []);

      await expect(
        //@ts-ignore
        tokenSale.write.buyTokens([user.account.address, 'referrer'], {
          account: user.account,
          value: ethAmount,
        }),
      ).to.be.rejectedWith('RoundIsNotInProgress()');
    });
    it('Should not allow to buy tokens with eth if current round is stopped', async () => {
      const { tokenSale, user } = await loadFixture(deployEthTokenSale);

      const ethAmount = parseEther('10');

      await tokenSale.write.stopRound();

      await expect(
        // @ts-ignore
        tokenSale.write.buyTokens([user.account.address, 'referrer'], {
          account: user.account,
          value: ethAmount,
        }),
      ).to.be.rejectedWith('RoundIsNotInProgress()');
    });
    it('Should not allow to buy tokens with usdt if current round is outdated', async () => {
      const { tokenSale, usdtToken, usdtHolder } =
        await loadFixture(deployEthTokenSale);

      const usdtAmount: bigint = parseUnits('502', 18);

      await network.provider.send('evm_increaseTime', [roundEndTime + 10]);
      await network.provider.send('evm_mine', []);

      await usdtToken.write.approve([tokenSale.address, usdtAmount], {
        account: usdtHolder.account,
      });

      await expect(
        tokenSale.write.buyTokens(
          [usdtHolder.account.address, 'referrer', usdtAmount],
          {
            account: usdtHolder.account,
          },
        ),
      ).to.be.rejectedWith('RoundIsNotInProgress()');
    });
    it('Should not allow to buy tokens with usdt if current round is stopped', async () => {
      const usdtAmount: bigint = parseUnits('502', 18);

      const { tokenSale, usdtToken, usdtHolder } =
        await loadFixture(deployEthTokenSale);

      await tokenSale.write.stopRound();

      await usdtToken.write.approve([tokenSale.address, usdtAmount], {
        account: usdtHolder.account,
      });

      await expect(
        tokenSale.write.buyTokens(
          [usdtHolder.account.address, 'referrer', usdtAmount],
          {
            account: usdtHolder.account,
          },
        ),
      ).to.be.rejectedWith('RoundIsNotInProgress()');
    });
    it('Should not allow to buy tokens with eth on usd equivalent less than threshold', async () => {
      const ethAmount: bigint = parseEther('0.1');

      const { tokenSale, user } = await loadFixture(deployEthTokenSale);

      await expect(
        // @ts-ignore
        tokenSale.write.buyTokens([user.account.address, 'referrer'], {
          account: user.account,
          value: ethAmount,
        }),
      ).to.be.rejected;
    });
    it('Should not allow to buy tokens with usdt on usd equivalent less than threshold', async () => {
      const usdtAmount: bigint = parseUnits('499', 18);

      const { tokenSale, usdtToken, usdtHolder } =
        await loadFixture(deployEthTokenSale);

      await usdtToken.write.approve([tokenSale.address, usdtAmount], {
        account: usdtHolder.account,
      });

      await expect(
        tokenSale.write.buyTokens(
          [usdtHolder.account.address, 'referrer', usdtAmount],
          {
            account: usdtHolder.account,
          },
        ),
      ).to.be.rejected;
    });
    it('Should not allow to buy tokens if max amount exceeded with usdt', async () => {
      const { tokenSale, usdtToken, usdtHolder } =
        await loadFixture(deployEthTokenSale);

      const usdtAmount: bigint = parseUnits('2000000', 6);

      await usdtToken.write.approve([tokenSale.address, usdtAmount], {
        account: usdtHolder.account,
      });

      await tokenSale.write.buyTokens(
        [
          usdtHolder.account.address,
          'referrer',
          parseUnits(usdtAmount.toString(), 12),
        ],
        { account: usdtHolder.account },
      );

      await usdtToken.write.approve([tokenSale.address, usdtAmount], {
        account: usdtHolder.account,
      });

      await expect(
        tokenSale.write.buyTokens(
          [
            usdtHolder.account.address,
            'referrer',
            parseUnits(usdtAmount.toString(), 12),
          ],
          {
            account: usdtHolder.account,
          },
        ),
      ).to.be.rejectedWith('ExceededTokenMaxAmount()');
    });
    it('Should not allow to buy tokens if max amount exceeded with eth', async () => {
      const ethAmount = parseEther('700');
      const { tokenSale, user } = await loadFixture(deployEthTokenSale);
      //@ts-ignore
      await tokenSale.write.buyTokens([user.account.address, 'referrer'], {
        value: ethAmount,
      });
      await expect(
        //@ts-ignore
        tokenSale.write.buyTokens([user.account.address, 'referrer'], {
          value: ethAmount,
        }),
      ).to.be.rejectedWith('ExceededTokenMaxAmount');
    });
    it('Should not allow to buy tokens if max amount exceeded with eth and usdt', async () => {
      const { tokenSale, usdtToken, usdtHolder, user } =
        await loadFixture(deployEthTokenSale);

      const usdtAmount: bigint = parseUnits('1500000', 6);
      const ethAmount = parseEther('1000');

      await usdtToken.write.approve([tokenSale.address, usdtAmount], {
        account: usdtHolder.account,
      });

      await tokenSale.write.buyTokens(
        [
          usdtHolder.account.address,
          'referrer',
          parseUnits(usdtAmount.toString(), 12),
        ],
        { account: usdtHolder.account },
      );

      await expect(
        // @ts-ignore
        tokenSale.write.buyTokens([user.account.address, 'referrer'], {
          account: user.account,
          value: ethAmount,
        }),
      ).to.be.rejectedWith('ExceededTokenMaxAmount');
    });
  });
  describe('Withdraw', () => {
    it('Should allow withdrawOwner only by owner', async () => {
      const { tokenSale, user } = await loadFixture(deployEthTokenSale);

      await expect(
        tokenSale.write.withdrawOwner([1234n, true], { account: user.account }),
      ).to.be.rejected;
    });
    it('Should withdraw usdt', async () => {
      const { tokenSale, usdtToken, usdtHolder, owner } =
        await loadFixture(deployEthTokenSale);

      const usdtAmount: bigint = parseUnits('505', 18);

      await usdtToken.write.approve([tokenSale.address, usdtAmount], {
        account: usdtHolder.account,
      });

      await tokenSale.write.buyTokens(
        [usdtHolder.account.address, 'referrer', usdtAmount],
        {
          account: usdtHolder.account,
        },
      );

      const amountToWithdraw = 500n;

      const initBalance = await usdtToken.read.balanceOf([
        owner.account.address,
      ]);

      await tokenSale.write.withdrawOwner([usdtAmount, false]);

      const currentBalance = await usdtToken.read.balanceOf([
        owner.account.address,
      ]);

      expect(currentBalance).to.equal(initBalance + parseUnits('505', 6));
    });
    it('Should withdraw 18-decimals usdt', async () => {
      const { tokenSale, tether, owner } = await loadFixture(deployWithMocked);

      const usdtAmount: bigint = parseUnits('505', 18);

      await tether.write.approve([tokenSale.address, usdtAmount], {
        account: owner.account,
      });

      await tokenSale.write.buyTokens(
        [owner.account.address, 'referrer', usdtAmount],
        {
          account: owner.account,
        },
      );

      const initBalance = await tether.read.balanceOf([owner.account.address]);

      await tokenSale.write.withdrawOwner([usdtAmount, false]);

      const currentBalance = await tether.read.balanceOf([
        owner.account.address,
      ]);

      expect(currentBalance).to.equal(initBalance + parseUnits('505', 18));
    });
    it('Should withdraw with eth', async () => {
      const ethAmount = parseUnits('40', 18);
      const { tokenSale, user, owner } = await loadFixture(deployEthTokenSale);
      //@ts-ignore
      await tokenSale.write.buyTokens([user.account.address, 'referrer'], {
        value: ethAmount,
      });
      const client = await viem.getPublicClient();

      const initBalance = await client.getBalance(owner.account);

      await tokenSale.write.withdrawOwner([ethAmount, true]);

      const currentBalance = await client.getBalance(owner.account);

      expect(Number(formatUnits(currentBalance, 18))).to.be.gt(
        Number(formatUnits(initBalance, 18)),
      );
    });
  });
});
