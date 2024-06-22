import { Button } from '../ui/button';
import { Copy } from 'lucide-react';
import { CopyButton } from '../ui/copy-button';
import { DialogClose } from '../ui/dialog';

export const NftRedeemSuccessModal = () => {
  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      <h2 className="text-lg font-semibold">Success!</h2>
      <p>Provide this url to support to get your item</p>
      <div className="relative">
        <CopyButton
          data="https://etherscan.io/address/0x271682DEB8C4E0901D1a1550aD2e64D568E69909"
          className="rounded-[16px] py-2 px-4 w-full overflow-hidden bg-violent relative"
        >
          <p className="truncate max-w-full pr-3 w-full">
            https://etherscan.io/address/0x271682DEB8C4E0901D1a1550aD2e64D568E69909
          </p>
          <div className="absolute right-0 flex items-center top-0 h-full bg-violent p-2 ">
            <Copy className="w-4 h-4" />
          </div>
        </CopyButton>
      </div>

      <DialogClose asChild>
        <Button className="flex-1 py-3 text-base">Got it!</Button>
      </DialogClose>
    </div>
  );
};
