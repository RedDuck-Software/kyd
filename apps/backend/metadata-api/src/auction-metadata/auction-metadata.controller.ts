import { Body, Controller, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AuctionMetadataService } from './auction-metadata.service';
import 'multer';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';
import { AuctionMetadataEntity } from '../database/metadata';

const mediaOptions: MulterOptions = {
  limits: { fieldSize: 100_000_000 },
};

export class CreateAuctionMetadataRequestDto {
  @ApiProperty({ type: String, nullable: false, maxLength: 255 })
  @IsString()
  @MaxLength(255)
  description: string;

  @ApiProperty({ type: String, nullable: false, maxLength: 255 })
  @IsString()
  @MaxLength(255)
  name: string;
}

@Controller('auction-metadata')
@ApiTags('Auctions')
export class AuctionMetadataController {
  constructor(private readonly auctionMetadataService: AuctionMetadataService) {}

  @Get('/:id')
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
    name: 'id',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Auction metadata UUID',
  })
  @ApiResponse({
    status: 404,
    type: Error,
    description: 'Auction metadata not found',
  })
  public async getAuctionMetadata(@Param() { id }: { id: string }) {
    return await this.auctionMetadataService.getAuctionMetadata({ id });
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
    status: 200,
    type: AuctionMetadataEntity,
    description: 'Auction metadata',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['description', 'name', 'files'],
      properties: {
        description: { type: 'string', nullable: false, maxLength: 255 },
        name: {
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
    @Body() { description, name }: CreateAuctionMetadataRequestDto,
    @UploadedFiles() { files }: { files?: Express.Multer.File[] }
  ) {
    return await this.auctionMetadataService.createAuctionMetadata({
      description,
      name,
      files,
    });
  }
}
