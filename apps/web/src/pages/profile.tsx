import { ProfileInfo } from '@/components/profile/profile-info';
import { ProfileNfts } from '@/components/profile/profile-nfts';
import { ConnectWallet } from '@/components/wallet/connect-wallet-button';
import { useAccount } from 'wagmi';

export default function Profile() {
  const { address } = useAccount();
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-center font-bold text-[32px]">Profile</h1>
      <div className="flex flex-col gap-16">
        {address ? (
          <>
            <ProfileInfo />
            <ProfileNfts />
          </>
        ) : (
          <div className="flex justify-center">
            <ConnectWallet />
          </div>
        )}
      </div>
    </div>
  );
}
