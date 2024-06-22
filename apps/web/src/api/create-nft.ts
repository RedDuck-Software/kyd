import { toast } from '@/components/ui/use-toast';
import { httpClient } from './client';

export type CreateNFTMetadataDTO = {
  description: string;
  files: File[];
};

export type CreateNFTMetadataResponse = {
  description: string;
  imageUrl: string;
};

export const postCreateNFTMetadata = async (dto: CreateNFTMetadataDTO) => {
  const formData = new FormData();

  dto.files.forEach((file) => {
    formData.append(`files`, file, file.name);
  });

  formData.append('description', dto.description);

  try {
    return httpClient.post<CreateNFTMetadataResponse>('/nft-metadata', formData);
  } catch (e) {
    if (e instanceof Error) {
      toast({ title: 'Api error', description: e.message, variant: 'destructive' });
    }
    throw e;
  }
};
