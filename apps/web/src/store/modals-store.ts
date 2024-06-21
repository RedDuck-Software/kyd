import { create } from 'zustand';

interface ModalsStore {
  nftAlertModalOpen: boolean;
  nftRedeemModalOpen: boolean;
  nftRedeemSuccessModalOpen: boolean;
  setNftAlertModalOpen: (nftAlertModalOpen: boolean) => void;
  setNftRedeemModalOpen: (nftRedeemModalOpen: boolean) => void;
  setNftRedeemSuccessModalOpen: (nftRedeemSuccessModalOpen: boolean) => void;
}

const useModalsStore = create<ModalsStore>((set) => ({
  nftAlertModalOpen: false,
  setNftAlertModalOpen: (nftAlertModalOpen: boolean) => set({ nftAlertModalOpen }),
  nftRedeemModalOpen: false,
  setNftRedeemModalOpen: (nftRedeemModalOpen: boolean) => set({ nftRedeemModalOpen }),
  nftRedeemSuccessModalOpen: false,
  setNftRedeemSuccessModalOpen: (nftRedeemSuccessModalOpen: boolean) => set({ nftRedeemSuccessModalOpen }),
}));

export default useModalsStore;
