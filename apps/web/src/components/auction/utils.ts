import { Address, maxUint256 } from 'viem';

export type Nodes = {
  data: {
    user: `0x${string}`;
    amount: bigint;
  };
  prev: bigint;
  next: bigint;
}[];

export const getIndexesForInsert = (nodes: Nodes, address: Address, amount: bigint): [bigint, bigint, boolean] => {
  if (nodes.length === 0) return [BigInt(0), BigInt(0), false];

  const user = nodes.find((node) => node.data.user.toLowerCase() === address.toLowerCase());

  const firstNode = nodes.find((node) => node.prev === maxUint256)!;

  let currentNode = firstNode;

  const newAmount = user ? user.data.amount + amount : amount;

  // STOPS ON NODE THAT GREATER THAT OURS
  while (currentNode && newAmount > currentNode.data.amount) {
    if (currentNode.next === maxUint256) break;
    currentNode = nodes[+currentNode.next.toString()];
  }

  return [
    BigInt(nodes.indexOf(currentNode)),
    user ? BigInt(nodes.indexOf(user)) : BigInt(0),
    currentNode.prev !== maxUint256 && currentNode.data.amount < newAmount ? false : true,
  ];
};
