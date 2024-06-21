import { ZodType, z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export interface IAuctionSchema {
  new: string;
  confirm: string;
}

export const auctionSchema: ZodType<IAuctionSchema> = z
  .object({
    new: z.string().min(8),
    confirm: z.string().min(8),
  })
  .refine((data) => data.new === data.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  });
const {
  control,
  handleSubmit,
  formState: { errors },
  reset,
} = useForm<IAuctionSchema>({
  resolver: zodResolver(auctionSchema),
});
export const CreateAuctionForm = () => {
  return <form>create-form</form>;
};
