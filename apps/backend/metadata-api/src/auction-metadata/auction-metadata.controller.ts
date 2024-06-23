import { Body, Controller, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AuctionMetadataService, GetAuctionMetadataParams } from './auction-metadata.service';
import 'multer';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { AuctionMetadataEntity } from '../database/metadata';

const mediaOptions: MulterOptions = {
  limits: { fieldSize: 100_000_000 },
};

export class CreateAuctionMetadataRequestDto {
  @ApiProperty({ type: String, nullable: false, maxLength: 255, required: true })
  @IsString()
  description: string;

  @ApiProperty({ type: String, nullable: false, maxLength: 255, required: true })
  @IsString()
  name: string;

  @ApiProperty({ type: String, nullable: true, maxLength: 255, required: false })
  @IsOptional()
  @IsString()
  auctionId?: string;

  @ApiProperty({ type: String, nullable: false, maxLength: 255, required: true })
  @IsString()
  tokenId: string;
}

@Controller('auction-metadata')
@ApiTags('Auctions')
export class AuctionMetadataController {
  constructor(private readonly auctionMetadataService: AuctionMetadataService) {}

  @Get('/:auctionId/:tokenId')
  @ApiOperation({
    summary: 'Get auction metadata by ID',
    description: 'Get auction metadata by ID',
  })
  @ApiResponse({
    status: 200,
    type: AuctionMetadataEntity,
    description: 'Auction metadata',
  })
  @ApiParam({
    name: 'auctionId',
    type: String,
    example: '356xSKGa5hRhIDY',
    description: 'Auction metadata id',
  })
  @ApiParam({
    name: 'tokenId',
    type: String,
    example: '1',
    description: 'Auction token metadata id',
  })
  @ApiResponse({
    status: 404,
    type: Error,
    description: 'Auction metadata not found',
  })
  public async getAuctionMetadata(@Param() { auctionId, tokenId }: GetAuctionMetadataParams) {
    return await this.auctionMetadataService.getAuctionMetadata({ auctionId, tokenId });
  }

  @Get()
  @ApiOperation({
    summary: 'Get auction metadatas',
    description: 'Get auction metadatas',
  })
  @ApiResponse({
    status: 200,
    type: [AuctionMetadataEntity],
    description: 'Auction metadatas',
  })
  public async getAuctionMetadatas() {
    return await this.auctionMetadataService.getAuctionMetadatas();
  }

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 1 }], mediaOptions))
  @ApiOperation({
    summary: 'Create auction metadata',
    description: 'Create auction metadata',
  })
  @ApiResponse({
    status: 201,
    type: AuctionMetadataEntity,
    description: 'Auction metadata',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['description', 'name', 'files', 'tokenId'],
      properties: {
        description: { type: 'string', nullable: false, maxLength: 255 },
        name: {
          type: 'string',
          nullable: false,
          maxLength: 255,
        },
        auctionId: {
          type: 'string',
          nullable: true,
          maxLength: 255,
        },
        tokenId: {
          type: 'string',
          nullable: false,
          maxLength: 255,
        },
        files: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  public async createAuctionMetadata(
    @Body() { description, name, auctionId, tokenId }: CreateAuctionMetadataRequestDto,
    @UploadedFiles() { files }: { files?: Express.Multer.File[] }
  ) {
    return await this.auctionMetadataService.createAuctionMetadata({
      description,
      name,
      files,
      auctionId,
      tokenId,
    });
  }
}
