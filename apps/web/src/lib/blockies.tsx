// @ts-expect-error TYPES
import Blockies from 'react-blockies';
import { Address } from 'viem';

export const generateBlockies = (address: Address | undefined, size: number = 10, isRounded: boolean = true) => (
  <Blockies
    seed={address?.toString() || ''}
    size={size}
    scale={3}
    spotColor="#b4dcfa"
    color="#e3b4fa"
    bgColor="#FDF2EC"
    className={isRounded ? 'rounded-full' : ''}
  />
);
