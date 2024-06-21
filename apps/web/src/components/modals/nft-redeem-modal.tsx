import useModalsStore from '@/store/modals-store';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useState } from 'react';

export const NftRedeemModal = () => {
  const { setNftRedeemModalOpen, setNftRedeemSuccessModalOpen } = useModalsStore();
  const [code, setCode] = useState('');

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Redeem</h2>
      <div className="flex flex-col gap-2">
        <p>Provide code from support</p>
        <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Code..." />
      </div>

      <Button
        onClick={() => {
          setNftRedeemModalOpen(false);
          setNftRedeemSuccessModalOpen(true);
        }}
        disabled={!code}
        className="flex-1 py-3 text-base"
      >
        Redeem
      </Button>
    </div>
  );
};
