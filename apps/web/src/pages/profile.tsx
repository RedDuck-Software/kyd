import { ProfileInfo } from '@/components/profile/profile-info';
import { ProfileNfts } from '@/components/profile/profile-nfts';

export default function Profile() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-4xl text-center font-semibold">Profile</h1>
      <ProfileInfo />
      <ProfileNfts />
    </div>
  );
}
