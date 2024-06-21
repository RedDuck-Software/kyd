import useModalsStore from '@/store/modals-store';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useCallback, useState } from 'react';
import { Copy } from 'lucide-react';

export const NftRedeemSuccessModal = () => {
  const { setNftRedeemSuccessModalOpen } = useModalsStore();
  const [code, setCode] = useState('');

  const handleCopy = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
  }, []);

  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      <h2 className="text-lg font-semibold">Success!</h2>
      <p>Provide this url to support to get your item</p>
      <button className="rounded-[16px] p-2 overflow-hidden bg-gray-blue relative">
        <p className="truncate max-w-full w-full">
          https://etherscan.io/address/0x271682DEB8C4E0901D1a1550aD2e64D568E69909
        </p>
        <div className="absolute right-0 top-0 h-full bg-gray-blue p-2 ">
          <Copy />
        </div>
      </button>
      <div className="flex flex-col gap-2">
        <p>Provide code from support</p>
        <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Code..." />
      </div>

      <Button onClick={() => {}} disabled={!code} className="flex-1 py-3 text-base">
        Redeem
      </Button>
    </div>
  );
};
