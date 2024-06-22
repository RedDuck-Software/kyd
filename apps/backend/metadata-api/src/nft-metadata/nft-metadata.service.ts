import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { StorageService } from '../storage';
import { getFileRepository, getNftMetadataRepository } from '../database/metadata';
import crypto from 'node:crypto';
import { createId } from '../lib/nanoid';

export type GetNftMetadataParams = {
  nftId: string;
  tokenId: string;
};

type CreateNftMetadataParams = {
  description: string;
  files?: Express.Multer.File[];
  nftId?: string;
  tokenId: string;
};

const getFileExtensionFromFile = (fileName: string) => {
  const fileNameSplitted = fileName.split('.');
  fileNameSplitted.shift();

  return fileNameSplitted.length ? fileNameSplitted[fileNameSplitted.length - 1] : '';
};

@Injectable()
export class NftMetadataService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly storageService: StorageService
  ) {}

  public async createNftMetadata({ description, files, nftId, tokenId }: CreateNftMetadataParams) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    if (files.length > 1) {
      throw new BadRequestException('Only one file is allowed');
    }

    const file = files[0];

    if (file.size > 100_000_000) {
      throw new BadRequestException('File is too large');
    }

    const contentHash = crypto.createHash('sha256').update(file.buffer).digest('hex');

    return await this.dataSource.manager.transaction(async (manager) => {
      const nftMetadataRepository = getNftMetadataRepository(manager);
      const fileRepository = getFileRepository(manager);

      let savedFile = await fileRepository.findOneBy({ contentHash });
      if (savedFile) throw new BadRequestException('File already exists');

      savedFile = await fileRepository.save(
        fileRepository.create({
          contentHash,
          fileExtension: getFileExtensionFromFile(file.originalname),
        })
      );

      savedFile = {
        ...savedFile,
        ...(await this.storageService.writeFile({
          content: file.buffer,
          extension: savedFile.fileExtension,
          id: savedFile.id,
        })),
      };

      await fileRepository.save(savedFile);

      const nftMetadata = await nftMetadataRepository.save(
        nftMetadataRepository.create({
          description,
          imageUrl: `https://akrd.net/${savedFile.uri}`,
          nftId: nftId || createId(),
          tokenId,
        })
      );

      return nftMetadata;
    });
  }

  public async getNftMetadata({ nftId, tokenId }: GetNftMetadataParams) {
    const nftMetadataRepository = getNftMetadataRepository(this.dataSource.manager);

    const nftMetadata = await nftMetadataRepository.findOne({ where: { nftId, tokenId } });

    if (!nftMetadata) {
      throw new NotFoundException('NFT metadata not found');
    }

    return nftMetadata;
  }

  public async getNftMetadatas() {
    const nftMetadataRepository = getNftMetadataRepository(this.dataSource.manager);

    return await nftMetadataRepository.getAll();
  }
}
