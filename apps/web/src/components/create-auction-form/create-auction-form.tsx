import { z } from 'zod';
import { useForm, SubmitHandler, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { useAccount, useChainId, useWriteContract } from 'wagmi';
import { getAddress, parseUnits, zeroAddress, zeroHash } from 'viem';
import { useEffect, useState } from 'react';
import { AuctionFactoryAbi } from '@/abi/AuctionFactory';
import { addresses, AllowedChainIds, allowedTokens } from '@/constants/addresses';
import { Dropzone } from './dropzone';
import { emptyFile } from '@/constants/empty-file';
import { postCreateNFTMetadata } from '@/api/create-nft';
import { generateWinnerArray } from '@/lib/generateWinnersArray';
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from '../ui/multiple-select';
import { env } from '@/env';
import { postCreateAuctionMetadata } from '@/api/create-auction';
import { toast } from '../ui/use-toast';
import { Spinner } from '../ui/spinner';
import { useNavigate } from 'react-router-dom';

const schema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(15, 'Description must be at least 15 characters'),
    auctionImage: z.any().refine((file) => file instanceof File, 'Image is required'),
    goal: z.string().min(1, 'Title is required'),
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
    stables: z.array(z.string()).nonempty('At least one stable must be selected'),
    enableTopDonateWinners: z.boolean().default(false),
    enableRandomWinners: z.boolean().default(false),
  })
  .refine((data) => data.enableTopDonateWinners || data.enableRandomWinners, {
    message: 'At least one of Set Top-Donate Prizes or Set Random Winners must be selected',
    path: ['enableTopDonateWinners'],
  });

type CreateFormData = z.infer<typeof schema>;

export const CreateAuctionForm = () => {
  const navigate = useNavigate();
  const chainId = useChainId();
  const { address } = useAccount();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<CreateFormData>({
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

  const [isLoading, setIsLoading] = useState(false);

  const [enableTopDonateWinners, setEnableTopDonateWinners] = useState(false);
  const [enableRandomWinners, setEnableRandomWinners] = useState(false);

  const { writeContractAsync } = useWriteContract();

  const options: { label: string; value: string }[] = [
    {
      label: 'USDT',
      value: allowedTokens[chainId as AllowedChainIds].find((x) => x.symbol === 'USDT')?.address ?? zeroAddress,
    },
  ];

  useEffect(() => {
    if (enableTopDonateWinners && topWinnerFields.length === 0) {
      appendTopWinner({ amount: '', winnerNFT: { name: '', image: emptyFile } });
    }
  }, [appendTopWinner, enableTopDonateWinners, topWinnerFields.length]);

  const handleCreateAuction = async (data: CreateFormData) => {
    if (!address) return;
    setIsLoading(true);

    let topWinnerNftId: string | undefined = undefined;
    // let randomWinnerNftId: string | undefined = undefined;
    let participantNftId: string | undefined = undefined;

    // Top winners

    const topWinners = data.topDonateWinners;
    const topWinnersArr = generateWinnerArray(topWinners ?? []);

    if (enableTopDonateWinners && topWinners) {
      const firstEl = topWinnersArr[0];
      const { data } = await postCreateNFTMetadata({
        description: firstEl.name,
        files: [firstEl.file],
        tokenId: '0',
      });

      topWinnerNftId = data?.nftId;

      await Promise.all(
        topWinnersArr.slice(1).map(({ name, file }, i) => {
          return postCreateNFTMetadata({
            description: name,
            files: [file],
            tokenId: String(i + 1),
            nftId: data?.nftId,
          });
        })
      )
        .then((results) => {
          console.log('All NFT metadata created:', results);
        })
        .catch((error) => {
          console.error('Error creating NFT metadata:', error);
        });
    }

    // Random winners

    const randomWinner = data.randomWinner;
    if (enableRandomWinners && randomWinner) {
      const { data } = await postCreateNFTMetadata({
        description: randomWinner.name,
        files: [randomWinner.image],
        tokenId: String(topWinnersArr.length),
      });

      // randomWinnerNftId = data?.nftId;

      await Promise.all(
        Array.from({ length: Number(randomWinner.amount) }).map((_, i) => {
          return postCreateNFTMetadata({
            description: randomWinner.name,
            files: [randomWinner.image],
            tokenId: String(i + 1),
            nftId: data?.nftId,
          });
        })
      );
    }

    const { data: participantData } = await postCreateNFTMetadata({
      description: data.participantNFT.name,
      files: [data.participantNFT.image],
      tokenId: '0',
    });

    participantNftId = participantData?.nftId;

    const createAuctionResponse = await postCreateAuctionMetadata({
      name: data.title,
      description: data.description,
      files: [data.auctionImage],
      tokenId: '0',
    });

    const auctionId = createAuctionResponse?.data?.auctionId;

    console.log('data.topDonateWinners ==>', data.topDonateWinners);

    const auctionCreateData = {
      stables: data.stables.map((token) => getAddress(token)),
      ethToStablePath:
        allowedTokens[chainId as AllowedChainIds].find((x) => x.symbol === 'USDT')?.ethToStablePath ?? zeroHash,
      swapStable: getAddress(
        allowedTokens[chainId as AllowedChainIds].find((x) => x.symbol === 'USDT')?.address ?? zeroAddress
      ), //TODO: change later
      uniswapV3Router: addresses[chainId].uniswapV3Router,
      topWinners:
        enableTopDonateWinners && data.topDonateWinners
          ? Array.from({
              length: data.topDonateWinners.reduce((acc, val) => {
                return (acc += Number(val.amount));
              }, 0),
            }).map((_, i) => BigInt(i))
          : [],
      goal: parseUnits(data.goal, 18),
      owner: address,
      randomWinners: enableRandomWinners ? BigInt(data.randomWinner?.amount ?? 0) : 0n,
      randomWinnerNftId: enableRandomWinners ? BigInt(topWinnersArr.length) : 0n,
      baseUri: `${env.VITE_BACKEND_URL}/api/auction-metadata/${auctionId}/`,
    };

    console.log('auctionCreateData ==>', auctionCreateData);

    const winnerNft = {
      name: (data.topDonateWinners?.[0]?.winnerNFT?.name || data.randomWinner?.name) as string,
      symb: 'kyd-nft-winner',
      uri: `${env.VITE_BACKEND_URL}/api/nft-metadata/${topWinnerNftId}/`,
    };

    const participantNft = {
      name: data.participantNFT.name,
      symb: 'kyd-nft-participant',
      uri: `${env.VITE_BACKEND_URL}/api/nft-metadata/${participantNftId}/`,
    };

    console.log('winnerNft ==>', winnerNft);
    console.log('participantNft ==>', participantNft);
    console.log('addresses[chainId].auctionFactory ==>', addresses[chainId].auctionFactory);

    try {
      const hash = await writeContractAsync({
        abi: AuctionFactoryAbi,
        address: addresses[chainId].auctionFactory,
        functionName: 'create',
        args: [auctionCreateData, winnerNft, participantNft],
      });

      toast({ title: 'Auction created successfully', description: `Transaction hash: ${hash}` });
      navigate('/');
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNumberInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: `topDonateWinners.${number}.amount` | 'randomWinner.amount' | 'goal'
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setValue(field, value, { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<CreateFormData> = (data) => {
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
          <div className="flex flex-col gap-2">
            <p>Goal</p>
            <Input
              placeholder="Target auction gatheting amount"
              {...register('goal')}
              onChange={(e) => handleNumberInputChange(e, 'goal')}
            />
            {errors.goal && <p className="text-danger">{errors.goal.message}</p>}
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <Switch
            id="topDonateWinners"
            onCheckedChange={(checked) => {
              setEnableTopDonateWinners(checked);
              setValue('enableTopDonateWinners', checked);
            }}
            checked={enableTopDonateWinners}
          />
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
          <Switch
            id="randomWinners"
            onCheckedChange={(checked) => {
              setEnableRandomWinners(checked);
              setValue('enableRandomWinners', checked);
            }}
            checked={enableRandomWinners}
          />
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

        <div className="flex flex-col gap-2">
          <p>Select allowed tokens</p>
          <Controller
            name="stables"
            control={control}
            render={({ field }) => (
              <MultiSelector values={field.value ?? []} onValuesChange={field.onChange} loop={false}>
                <MultiSelectorTrigger>
                  <MultiSelectorInput placeholder="Select allowed tokens" />
                </MultiSelectorTrigger>
                <MultiSelectorContent>
                  <MultiSelectorList>
                    {options?.map((option, i) => (
                      <MultiSelectorItem key={i} value={option.value}>
                        {option.label}
                      </MultiSelectorItem>
                    ))}
                  </MultiSelectorList>
                </MultiSelectorContent>
              </MultiSelector>
            )}
          />
          {errors.stables && <p className="text-danger">{errors.stables.message}</p>}
        </div>

        {errors.enableTopDonateWinners && <p className="text-danger">{errors.enableTopDonateWinners.message}</p>}
        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? <Spinner className="w-5 h-5" /> : 'Submit'}
        </Button>
      </form>
    </div>
  );
};
