import { Body, Controller, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import 'multer';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';
import { NftMetadataService } from './nft-metadata.service';
import { NftMetadataEntity } from '../database/metadata';

const mediaOptions: MulterOptions = {
  limits: { fieldSize: 100_000_000 },
};

export class CreateNftMetadataRequestDto {
  @ApiProperty({ type: String, nullable: false, maxLength: 255 })
  @IsString()
  @MaxLength(255)
  description: string;
}

@Controller('nft-metadata')
export class NftMetadataController {
  constructor(private readonly nftMetadataService: NftMetadataService) {}

  @Get('/:id')
  @ApiOperation({
    summary: 'Get nft metadata by ID',
    description: 'Get nft metadata by ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Nft metadata UUID',
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
  public async getNftMetadata(@Param() { id }: { id: string }) {
    return await this.nftMetadataService.getNftMetadata({ id });
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
    status: 200,
    type: NftMetadataEntity,
    description: 'Nft metadata',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['description', 'files'],
      properties: {
        description: { type: 'string', nullable: false, maxLength: 255 },
        files: {
          type: 'string',
          format: 'binary',
          nullable: false,
        },
      },
    },
  })
  public async createNftMetadata(
    @Body() { description }: CreateNftMetadataRequestDto,
    @UploadedFiles() { files }: { files?: Express.Multer.File[] }
  ) {
    return await this.nftMetadataService.createNftMetadata({
      description,
      files,
    });
  }
}
