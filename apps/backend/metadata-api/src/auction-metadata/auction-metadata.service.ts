import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { StorageService } from '../storage';
import { getAuctionMetadataRepository, getFileRepository } from '../database/metadata';
import crypto from 'node:crypto';
import { createId } from '../lib/nanoid';

export type GetAuctionMetadataParams = {
  auctionId: string;
  tokenId: string;
};

type CreateAuctionMetadataParams = {
  description: string;
  name: string;
  files?: Express.Multer.File[];
  auctionId?: string;
  tokenId: string;
};

const getFileExtensionFromFile = (fileName: string) => {
  const fileNameSplitted = fileName.split('.');
  fileNameSplitted.shift();

  return fileNameSplitted.length ? fileNameSplitted[fileNameSplitted.length - 1] : '';
};

@Injectable()
export class AuctionMetadataService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly storageService: StorageService
  ) {}

  public async createAuctionMetadata({ description, name, files, tokenId, auctionId }: CreateAuctionMetadataParams) {
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
      const auctionMetadataRepository = getAuctionMetadataRepository(manager);
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

      const auctionMetadata = await auctionMetadataRepository.save(
        auctionMetadataRepository.create({
          name,
          description,
          uri: `https://akrd.net/${savedFile.uri}`,
          auctionId: auctionId || createId(),
          tokenId,
        })
      );

      return auctionMetadata;
    });
  }

  public async getAuctionMetadata({ auctionId, tokenId }: GetAuctionMetadataParams) {
    const auctionMetadataRepository = getAuctionMetadataRepository(this.dataSource.manager);

    const auctionMetadata = await auctionMetadataRepository.findOne({
      where: { auctionId, tokenId },
    });

    if (!auctionMetadata) {
      throw new NotFoundException('Auction metadata not found');
    }

    return auctionMetadata;
  }

  public async getAuctionMetadatas() {
    const auctionMetadataRepository = getAuctionMetadataRepository(this.dataSource.manager);

    return await auctionMetadataRepository.getAll();
  }
}
