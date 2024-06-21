import { z } from 'zod';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const schema = z.object({
  topDonateWinners: z
    .array(
      z.object({
        range: z.string().min(1, 'Range is required'),
        prize: z.string().min(1, 'Prize is required'),
      })
    )
    .optional(),
  randomWinners: z
    .object({
      number: z.string().min(1, 'Random winners number is required'),
      prize: z.string().min(1, 'Prize is required'),
    })
    .optional(),
});

type FormData = z.infer<typeof schema>;

export const CreateAuctionForm = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'topDonateWinners',
  });
  const [enableTopDonateWinners, setEnableTopDonateWinners] = useState(false);
  const [enableRandomWinners, setEnableRandomWinners] = useState(false);

  const onSubmit: SubmitHandler<FormData> = (data) => console.log(data);

  useEffect(() => {
    if (enableTopDonateWinners && fields.length === 0) {
      append({ range: '', prize: '' });
    } else if (!enableTopDonateWinners && fields.length > 0) {
      remove();
    }
  }, [enableTopDonateWinners, append, fields.length, remove]);

  return (
    <div className="flex justify-center min-w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-[536px]">
        <div>
          <input
            type="checkbox"
            id="topDonateWinners"
            className="mr-2"
            onChange={() => setEnableTopDonateWinners(!enableTopDonateWinners)}
          />
          <label htmlFor="topDonateWinners">Enable Top-Donate Winners</label>
        </div>
        {enableTopDonateWinners && (
          <div className="flex flex-col gap-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-col gap-1">
                <div className="flex space-x-4">
                  <Input
                    {...register(`topDonateWinners.${index}.range` as const)}
                    placeholder="Range"
                    className="sm:min-w-[260px] w-full max-w-xs"
                  />
                  <Input
                    {...register(`topDonateWinners.${index}.prize` as const)}
                    placeholder="Prize in usd"
                    className="sm:min-w-[260px] w-full max-w-xs"
                  />
                </div>
                <div>
                  {errors.topDonateWinners && errors.topDonateWinners[index]?.range && (
                    <p className="text-red-500 text-sm">{errors.topDonateWinners[index].range?.message}</p>
                  )}
                  {errors.topDonateWinners &&
                    errors.topDonateWinners[index]?.prize &&
                    !errors.topDonateWinners[index]?.range && (
                      <p className="text-red-500 text-sm">{errors.topDonateWinners[index].prize?.message}</p>
                    )}
                </div>
              </div>
            ))}
            <div className="flex justify-start">
              <Button type="button" onClick={() => append({ range: '', prize: '' })}>
                Add Another Range and Prize
              </Button>
            </div>
          </div>
        )}

        <div>
          <input
            type="checkbox"
            id="randomWinners"
            className="mr-2"
            onChange={() => setEnableRandomWinners(!enableRandomWinners)}
          />
          <label htmlFor="randomWinners">Enable Random Winners</label>
        </div>
        {enableRandomWinners && (
          <div className="flex flex-col gap-1">
            <div className="flex space-x-4">
              <Input
                {...register('randomWinners.number' as const)}
                placeholder="Number of Random Winners"
                className="sm:min-w-[260px] w-full max-w-xs"
              />
              <Input
                {...register('randomWinners.prize' as const)}
                placeholder="Prize in usd"
                className="sm:min-w-[260px] w-full max-w-xs"
              />
            </div>
            <div>
              {errors.randomWinners?.number && (
                <p className="text-red-500 text-sm">{errors.randomWinners.number?.message}</p>
              )}
              {errors.randomWinners?.prize && !errors.randomWinners?.number && (
                <p className="text-red-500 text-sm">{errors.randomWinners.prize?.message}</p>
              )}
            </div>
          </div>
        )}
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};
