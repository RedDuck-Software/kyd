import { create } from 'zustand';

interface NftData {
  nftAddress?: string;
  tokenId?: string;
}

interface ModalsStore {
  nftAlertModalOpen: boolean;
  nftRedeemModalOpen: boolean;
  nftRedeemSuccessModalOpen: boolean;
  dialogNftData: NftData | null;
  setNftAlertModalOpen: (nftAlertModalOpen: boolean) => void;
  setNftRedeemModalOpen: (nftRedeemModalOpen: boolean) => void;
  setNftRedeemSuccessModalOpen: (nftRedeemSuccessModalOpen: boolean) => void;
  setDialogNftData: (nftData: NftData | null) => void;
}

const useModalsStore = create<ModalsStore>((set) => ({
  nftAlertModalOpen: false,
  setNftAlertModalOpen: (nftAlertModalOpen: boolean) => set({ nftAlertModalOpen }),
  nftRedeemModalOpen: false,
  setNftRedeemModalOpen: (nftRedeemModalOpen: boolean) => set({ nftRedeemModalOpen }),
  nftRedeemSuccessModalOpen: false,
  setNftRedeemSuccessModalOpen: (nftRedeemSuccessModalOpen: boolean) => set({ nftRedeemSuccessModalOpen }),
  dialogNftData: null,
  setDialogNftData: (nftData: NftData | null) => set({ dialogNftData: nftData }),
}));

export default useModalsStore;
