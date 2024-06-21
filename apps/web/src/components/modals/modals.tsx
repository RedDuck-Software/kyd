import useModalsStore from '@/store/modals-store';
import { Dialog, DialogContent } from '../ui/dialog';
import { NftAlertModal } from './nft-alert-modal';
import { NftRedeemModal } from './nft-redeem-modal';
import { NftRedeemSuccessModal } from './nft-redeem-success-modal';

export const Modals = () => {
  const {
    nftAlertModalOpen,
    setNftAlertModalOpen,
    nftRedeemModalOpen,
    setNftRedeemModalOpen,
    nftRedeemSuccessModalOpen,
    setNftRedeemSuccessModalOpen,
  } = useModalsStore();
  return (
    <>
      <Dialog open={nftAlertModalOpen} onOpenChange={setNftAlertModalOpen}>
        <DialogContent>
          <NftAlertModal />
        </DialogContent>
      </Dialog>
      <Dialog open={nftRedeemModalOpen} onOpenChange={setNftRedeemModalOpen}>
        <DialogContent>
          <NftRedeemModal />
        </DialogContent>
      </Dialog>
      <Dialog modal open={nftRedeemSuccessModalOpen} onOpenChange={setNftRedeemSuccessModalOpen}>
        <DialogContent>
          <NftRedeemSuccessModal />
        </DialogContent>
      </Dialog>
    </>
  );
};
