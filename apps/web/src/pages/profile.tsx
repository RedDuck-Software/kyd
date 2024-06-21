import { ProfileInfo } from '@/components/profile/profile-info';
import { ProfileNfts } from '@/components/profile/profile-nfts';
import { ProfilePastAuctions } from '@/components/profile/profile-past-auctions';

export default function Profile() {
  return (
    <div className="flex flex-col gap-12">
      <ProfileInfo />
      <ProfileNfts />
      <ProfilePastAuctions />
    </div>
  );
}
