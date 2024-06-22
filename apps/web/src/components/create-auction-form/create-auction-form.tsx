import { z } from 'zod';
import { useForm, SubmitHandler, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { useAccount, useChainId, useWriteContract } from 'wagmi';
import { Address, parseUnits, zeroAddress } from 'viem';
import { useEffect, useState } from 'react';
import { AUctionFactoryAbi } from '@/abi/AuctionFactory';
import { addresses } from '@/constants/addresses';
import { Dropzone } from './dropzone';
import { emptyFile } from '@/constants/empty-file';
import { postCreateNFTMetadata } from '@/api/create-nft';
import { generateWinnerImagesArray } from '@/lib/generateWinnersArray';
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from '../ui/multiple-select';

const options: { label: string; value: string }[] = [
  { label: 'USDT', value: 'USDT' },
  { label: 'USDC', value: 'USDC' },
  { label: 'DAI', value: 'DAI' },
];

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(15, 'Description must be at least 15 characters'),
  auctionImage: z.any().refine((file) => file instanceof File, 'Image is required'),
  topDonateWinners: z
    .array(
      z.object({
        amount: z.string().min(1, 'Amount is required'),
        winnerNFT: z.object({
          name: z.string().min(1, 'Name is required'),
          image: z.any().refine((file) => file instanceof File, 'Image is required'),
        }),
      })
    )
    .optional(),
  participantNFT: z.object({
    name: z.string().min(1, 'Name is required'),
    image: z.any().refine((file) => file instanceof File, 'Image is required'),
  }),
  randomWinner: z
    .object({
      amount: z.string().min(1, 'Random winners amount is required'),
      name: z.string().min(1, 'Name is required'),
      image: z.any().refine((file) => file instanceof File, 'Image is required'),
    })
    .optional(),
});

type FormData = z.infer<typeof schema>;

export const CreateAuctionForm = () => {
  const chainId = useChainId();
  const { address } = useAccount();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const {
    fields: topWinnerFields,
    append: appendTopWinner,
    remove: removeTopWinner,
  } = useFieldArray({
    control,
    name: 'topDonateWinners',
  });

  const [enableTopDonateWinners, setEnableTopDonateWinners] = useState(false);
  const [enableRandomWinners, setEnableRandomWinners] = useState(false);
  const [stables, setStables] = useState<string[]>([]);

  const { writeContractAsync } = useWriteContract();

  useEffect(() => {
    if (enableTopDonateWinners && topWinnerFields.length === 0) {
      appendTopWinner({ amount: '', winnerNFT: { name: '', image: emptyFile } });
    }
  }, [appendTopWinner, enableTopDonateWinners, topWinnerFields.length]);

  const handleCreateAuction = async (data: FormData) => {
    if (!address) return;

    // const selectedStables: Address[] = [];
    // const goal = parseUnits('10000', 18);
    // const randomWinners = parseUnits(data.randomWinner?.amount ?? '0', 18);
    // const randomWinnerNftId = parseUnits('1', 18);

    const topWinners = generateWinnerImagesArray(data.topDonateWinners ?? []);

    console.log('topWinners ==>', topWinners);

    // const auctionCreateData = {
    //   stables: selectedStables,
    //   topWinners,
    //   goal,
    //   owner: address,
    //   randomWinners,
    //   randomWinnerNftId,
    // };

    // const winnerNft = {
    //   name: 'data.winnerNFT.name',
    //   symb: 'kyd-nft-winner',
    //   // uri: data.winnerNFT.imageUrl,
    //   uri: '',
    // };

    // const participantNft = {
    //   name: data.participantNFT.name,
    //   symb: 'kyd-nft-participant',
    //   // uri: data.participantNFT.imageUrl,
    //   uri: '',
    // };

    // await writeContractAsync({
    //   abi: AUctionFactoryAbi,
    //   address: addresses[chainId].auctionFactory,
    //   functionName: 'create',
    //   args: [auctionCreateData, winnerNft, participantNft],
    // });
  };

  const handleNumberInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: `topDonateWinners.${number}.amount` | 'randomWinner.amount'
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setValue(field, value, { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);
    handleCreateAuction(data);
  };

  return (
    <div className="flex justify-center min-w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-[640px]">
        <div className="p-4 rounded-lg border border-[#e5e5e5]">
          <div className="flex flex-col gap-2">
            <p>Auction title</p>
            <Input placeholder="Title" {...register('title')} />
            {errors.title && <p className="text-danger">{errors.title.message}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <p>Auction description</p>
            <Textarea placeholder="Description" className="resize-none" rows={3} {...register('description')} />
            {errors.description && <p className="text-danger">{errors.description.message}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <p>Auction Image</p>
            <Controller
              name="auctionImage"
              control={control}
              render={({ field }) => (
                <Dropzone
                  onDrop={(acceptedFiles) => field.onChange(acceptedFiles[0])}
                  label="Drag 'n' drop auction image here, or click to select file"
                />
              )}
            />
            {errors.auctionImage && <p className="text-danger">{errors.auctionImage.message}</p>}
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <Switch id="topDonateWinners" onCheckedChange={setEnableTopDonateWinners} checked={enableTopDonateWinners} />
          <label htmlFor="topDonateWinners" className="cursor-pointer">
            Set Top-Donate Prizes
          </label>
        </div>
        {enableTopDonateWinners && (
          <div className="p-4 rounded-lg border border-[#e5e5e5]">
            <div className="flex flex-col gap-2">
              {topWinnerFields.map((field, index) => (
                <div key={field.id} className="flex flex-col gap-2">
                  <div className="flex flex-col gap-2">
                    <div className="flex space-x-4">
                      <Input
                        type="text"
                        {...register(`topDonateWinners.${index}.amount`)}
                        placeholder="Winners amount"
                        className="sm:min-w-[260px] w-full max-w-xs"
                        onChange={(e) => handleNumberInputChange(e, `topDonateWinners.${index}.amount`)}
                      />
                      <Input placeholder="NFT Name" {...register(`topDonateWinners.${index}.winnerNFT.name`)} />
                    </div>
                    <Controller
                      name={`topDonateWinners.${index}.winnerNFT.image`}
                      control={control}
                      render={({ field }) => (
                        <Dropzone
                          onDrop={(acceptedFiles) => field.onChange(acceptedFiles[0])}
                          label="Drag 'n' drop winner NFT image here, or click to select file"
                        />
                      )}
                    />
                  </div>
                  <Button
                    className="border-red-500 hover:bg-red-500"
                    variant="outline"
                    type="button"
                    onClick={() => removeTopWinner(index)}
                  >
                    Remove
                  </Button>

                  <div>
                    {errors.topDonateWinners?.[index]?.amount && (
                      <p className="text-danger">{errors.topDonateWinners[index].amount.message}</p>
                    )}
                    {errors.topDonateWinners?.[index]?.winnerNFT?.name && (
                      <p className="text-danger">{errors.topDonateWinners[index].winnerNFT.name.message}</p>
                    )}
                    {errors.topDonateWinners?.[index]?.winnerNFT?.image && (
                      <p className="text-danger">{errors.topDonateWinners[index].winnerNFT.image.message}</p>
                    )}
                  </div>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => appendTopWinner({ amount: '', winnerNFT: { name: '', image: emptyFile } })}
              >
                Add Winners
              </Button>
            </div>
          </div>
        )}

        <div className="flex gap-3 items-center">
          <Switch id="randomWinners" onCheckedChange={setEnableRandomWinners} checked={enableRandomWinners} />
          <label htmlFor="randomWinners" className="cursor-pointer">
            Set Random Winners
          </label>
        </div>

        {enableRandomWinners && (
          <div className="p-4 rounded-lg border border-[#e5e5e5]">
            <div className="flex flex-col gap-1">
              <div className="flex space-x-4">
                <Input
                  type="text"
                  {...register('randomWinner.amount')}
                  placeholder="Amount of Random Winners"
                  className="sm:min-w-[260px] w-full max-w-xs"
                  onChange={(e) => handleNumberInputChange(e, 'randomWinner.amount')}
                />
              </div>
              <div>{errors.randomWinner && <p className="text-red-500 text-sm">{errors.randomWinner.message}</p>}</div>
              <div className="flex flex-col gap-2">
                <p>Random Winner NFT</p>
                <Input placeholder="NFT Name" {...register('randomWinner.name')} />
                {errors.randomWinner?.name && <p className="text-danger">{errors.randomWinner.name.message}</p>}
                <Controller
                  name="randomWinner.image"
                  control={control}
                  render={({ field }) => (
                    <Dropzone
                      onDrop={(acceptedFiles) => field.onChange(acceptedFiles[0])}
                      label="Drag 'n' drop random winner NFT image here, or click to select file"
                    />
                  )}
                />
                {errors.randomWinner?.image && <p className="text-danger">{errors.randomWinner.image.message}</p>}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <p>Participant NFT</p>
          <Input placeholder="Name" {...register('participantNFT.name')} />
          {errors.participantNFT?.name && <p className="text-danger">{errors.participantNFT.name.message}</p>}
          <Controller
            name="participantNFT.image"
            control={control}
            render={({ field }) => (
              <Dropzone
                onDrop={(acceptedFiles) => field.onChange(acceptedFiles[0])}
                label="Drag 'n' drop participant NFT image here, or click to select file"
              />
            )}
          />
          {errors.participantNFT?.image && <p className="text-danger">{errors.participantNFT.image.message}</p>}
        </div>

        <div>
          <p>Allowed Tokens</p>
          <MultiSelector values={stables} onValuesChange={setStables} loop={false}>
            <MultiSelectorTrigger>
              <MultiSelectorInput placeholder="Select allowed tokens" />
            </MultiSelectorTrigger>
            <MultiSelectorContent>
              <MultiSelectorList>
                {options.map((option, i) => (
                  <MultiSelectorItem key={i} value={option.value}>
                    {option.label}
                  </MultiSelectorItem>
                ))}
              </MultiSelectorList>
            </MultiSelectorContent>
          </MultiSelector>
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};
