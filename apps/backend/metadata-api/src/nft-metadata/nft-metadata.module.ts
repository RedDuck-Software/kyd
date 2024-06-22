import { Module } from '@nestjs/common';
import { NftMetadataService } from './nft-metadata.service';
import { NftMetadataController } from './nft-metadata.controller';

@Module({
  imports: [],
  controllers: [NftMetadataController],
  providers: [NftMetadataService],
})
export class NftMetadataModule {}
