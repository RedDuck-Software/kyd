import { cn } from '@/lib/utils';
import { ReactNode, useState } from 'react';
import { Tooltip, TooltipProvider } from './tooltip';

type Props = {
  className?: string;
  data: string;
  children: ReactNode;
};

export const CopyButton = ({ data, className, children }: Props) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleCopy = async (address: string) => {
    await navigator.clipboard.writeText(address);
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 1000);
  };

  return (
    <TooltipProvider>
      <Tooltip open={isClicked} onOpenChange={setIsClicked}>
        <button onClick={() => handleCopy(data)} className={cn('', className)}>
          {children}
        </button>
        <div
          className={`${
            isClicked ? 'scale-100' : 'scale-0'
          } transition-all -top-10 text-base absolute left-1/2 -translate-x-1/2 bg-violent rounded-[6px] px-2 py-1`}
        >
          Copied
        </div>
      </Tooltip>
    </TooltipProvider>
  );
};
