import useModalsStore from '@/store/modals-store';
import { Button } from '../ui/button';
import { DialogClose } from '../ui/dialog';

export const NftAlertModal = () => {
  const { setNftAlertModalOpen, setNftRedeemModalOpen } = useModalsStore();
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Confirm redeem</h2>
      <p>I've got code from Support to redeem this NFT</p>
      <div className="flex gap-2 w-full">
        <DialogClose asChild>
          <Button variant={'outline'} className="flex-1 py-3  text-base">
            Cancel
          </Button>
        </DialogClose>
        <Button
          onClick={() => {
            setNftAlertModalOpen(false);
            setNftRedeemModalOpen(true);
          }}
          className="flex-1 py-3 text-base"
        >
          Confirm
        </Button>
      </div>
    </div>
  );
};
