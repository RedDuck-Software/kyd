import { toast } from '@/components/ui/use-toast';
import { httpClient } from './client';

export type CreateAuctionMetadataDTO = {
  name: string;
  description: string;
  files: File[];
  tokenId: string;
  auctionId?: string;
};

export type CreateAuctionMetadataResponse = {
  name: string;
  description: string;
  uri: string;
  tokenId: string;
  auctionId: string;
};

export const postCreateAuctionMetadata = async (dto: CreateAuctionMetadataDTO) => {
  const formData = new FormData();

  dto.files.forEach((file) => {
    formData.append(`files`, file, file.name);
  });

  formData.append('name', dto.name);
  formData.append('description', dto.description);

  try {
    return httpClient.post<CreateAuctionMetadataResponse>('api//auction-metadata', formData);
  } catch (e) {
    if (e instanceof Error) toast({ title: 'Api error', description: e.message, variant: 'destructive' });
  }
};
