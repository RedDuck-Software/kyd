import { Body, Controller, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import 'multer';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { GetNftMetadataParams, NftMetadataService } from './nft-metadata.service';
import { NftMetadataEntity } from '../database/metadata';

const mediaOptions: MulterOptions = {
  limits: { fieldSize: 100_000_000 },
};

export class CreateNftMetadataRequestDto {
  @ApiProperty({ type: String, nullable: false, maxLength: 255 })
  @IsString()
  @MaxLength(255)
  description: string;

  @ApiProperty({ type: String, nullable: true, maxLength: 255, required: false })
  @IsOptional()
  @IsString()
  nftId?: string;

  @ApiProperty({ type: String, nullable: false, maxLength: 255, required: true })
  @IsString()
  @MaxLength(255)
  tokenId: string;
}

@Controller('nft-metadata')
export class NftMetadataController {
  constructor(private readonly nftMetadataService: NftMetadataService) {}

  @Get('/:nftId/:tokenId')
  @ApiOperation({
    summary: 'Get nft metadata by ID',
    description: 'Get nft metadata by ID',
  })
  @ApiParam({
    name: 'nftId',
    type: String,
    example: '356xSKGa5hRhIDY',
    description: 'Nft metadata ID',
  })
  @ApiParam({
    name: 'tokenId',
    type: String,
    example: '1',
    description: 'Nft metadata token ID',
  })
  @ApiResponse({
    status: 200,
    type: NftMetadataEntity,
    description: 'Nft metadata',
  })
  @ApiResponse({
    status: 404,
    type: Error,
    description: 'Nft metadata not found',
  })
  public async getNftMetadata(@Param() { nftId, tokenId }: GetNftMetadataParams) {
    return await this.nftMetadataService.getNftMetadata({ nftId, tokenId });
  }

  @Get()
  @ApiOperation({
    summary: 'Get nft metadatas',
    description: 'Get nft metadatas',
  })
  @ApiResponse({
    status: 200,
    type: [NftMetadataEntity],
    description: 'Nft metadatas',
  })
  public async getNftMetadatas() {
    return await this.nftMetadataService.getNftMetadatas();
  }

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 1 }], mediaOptions))
  @ApiOperation({
    summary: 'Create nft metadata',
    description: 'Create nft metadata',
  })
  @ApiResponse({
    status: 201,
    type: NftMetadataEntity,
    description: 'Nft metadata',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['description', 'files', 'tokenId'],
      properties: {
        description: { type: 'string', nullable: false, maxLength: 255 },
        nftId: {
          type: 'string',
          nullable: true,
          maxLength: 255,
        },
        tokenId: {
          type: 'string',
          nullable: true,
          maxLength: 255,
        },
        files: {
          type: 'string',
          format: 'binary',
          nullable: false,
        },
      },
    },
  })
  public async createNftMetadata(
    @Body() { description, tokenId, nftId }: CreateNftMetadataRequestDto,
    @UploadedFiles() { files }: { files?: Express.Multer.File[] }
  ) {
    return await this.nftMetadataService.createNftMetadata({
      description,
      files,
      tokenId,
      nftId,
    });
  }
}
