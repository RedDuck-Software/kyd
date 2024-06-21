import { cn } from '@/lib/utils';
import { ReactNode, useState } from 'react';

type Props = {
  className?: string;
  data: string;
  children: ReactNode;
};

export const Copy = ({ data, className, children }: Props) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleCopy = async (address: string) => {
    await navigator.clipboard.writeText(address);
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 1000);
  };

  return (
    <button onClick={() => handleCopy(data)} className={cn('relative', className)}>
      <div
        className={`${
          isClicked ? 'scale-100' : 'scale-0'
        } transition-all -top-8 text-[12px] absolute left-1/2 -translate-x-1/2 bg-gray-blue rounded-[6px] px-2 py-1`}
      >
        Copied
      </div>
    </button>
  );
};
