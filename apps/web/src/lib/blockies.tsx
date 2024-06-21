// @ts-expect-error TYPES
import Blockies from 'react-blockies';
import { Address } from 'viem';

export const generateBlockies = (address: Address | null, size: number = 10) => (
  <Blockies seed={address?.toString() || ''} size={size} scale={3} className="rounded-full " />
);
