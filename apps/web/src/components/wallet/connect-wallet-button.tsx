import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount } from 'wagmi';

import { Button } from '../ui/button';

import { cn, shortenAddress } from '@/lib/utils';
import { generateBlockies } from '@/lib/blockies';

export const ConnectWallet = ({ className }: { className?: string }) => {
  const { address, isConnected } = useAccount();
  const { open } = useWeb3Modal();

  const btbClassName = 'rounded-full px-6 py-6 font-bold';

  if (!isConnected || !address) {
    return (
      <Button
        variant="default"
        className={cn(btbClassName, className, 'gap-2 rounded-[8px] h-[46px] text-[16px] ')}
        onClick={() => open({ view: 'Connect' })}
      >
        <span className="!text-white">Connect Wallet</span>
      </Button>
    );
  }

  return (
    <Button
      className={cn(btbClassName, className, 'flex gap-2 rounded-[8px] !text-white items-center')}
      onClick={() => open({ view: 'Account' })}
    >
      {generateBlockies(address, 8)}
      {shortenAddress(address)}
    </Button>
  );
};
