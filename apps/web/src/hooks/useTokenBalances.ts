import { Token } from '@/constants/addresses';

export interface TokenBalance extends Token {
  balance: bigint;
  allowance: bigint;
}
