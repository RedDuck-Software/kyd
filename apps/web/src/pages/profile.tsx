import { ProfileInfo } from '@/components/profile/profile-info';
import { ProfileNfts } from '@/components/profile/profile-nfts';
import { ProfilePastAuctions } from '@/components/profile/profile-past-auctions';

export default function Profile() {
  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-center font-bold text-[32px]">Profile</h1>
      <div className="flex flex-col gap-20">
        <ProfileInfo />
        <ProfileNfts />
        <ProfilePastAuctions />
      </div>
    </div>
  );
}
