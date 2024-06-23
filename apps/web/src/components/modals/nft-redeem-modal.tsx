import useModalsStore from '@/store/modals-store';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useCallback, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { usePublicClient, useWriteContract } from 'wagmi';
import { erc721ABI } from '@/abi/erc721ABI';

export const NftRedeemModal = () => {
  const { setNftRedeemModalOpen, setNftRedeemSuccessModalOpen } = useModalsStore();
  const [code, setCode] = useState('');
  const [isLoading, setLoading] = useState(false);

  const { toast } = useToast();

  const { writeContractAsync: redeemAsync } = useWriteContract();

  const redeem = useCallback(async () => {
    const hash = await redeemAsync({
      abi: erc721ABI,
      functionName: 'burn',
      // args: [],
    });
    return hash;
  }, [redeemAsync]);

  const publicClient = usePublicClient();

  const handleRedeem = useCallback(async () => {
    setLoading(true);

    try {
      const hash = await redeem();
      await publicClient?.waitForTransactionReceipt({
        hash,
      });
      toast({ title: 'Redeem success', variant: 'default' });
      setNftRedeemModalOpen(false);
      setNftRedeemSuccessModalOpen(true);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (error as Error).message ?? 'Failed to redeem',
      });
    } finally {
      setLoading(false);
    }
  }, [publicClient, redeem, setNftRedeemModalOpen, setNftRedeemSuccessModalOpen, toast]);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Redeem</h2>
      <div className="flex flex-col gap-2">
        <p>Provide code from support</p>
        <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Code..." />
      </div>

      <Button onClick={handleRedeem} disabled={!code || isLoading} className="flex-1 py-3 text-base">
        Redeem
      </Button>
    </div>
  );
};
