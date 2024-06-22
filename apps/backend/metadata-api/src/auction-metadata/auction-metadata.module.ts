import { Module } from '@nestjs/common';
import { AuctionMetadataController } from './auction-metadata.controller';
import { AuctionMetadataService } from './auction-metadata.service';

@Module({
  imports: [],
  controllers: [AuctionMetadataController],
  providers: [AuctionMetadataService],
})
export class AuctionMetadataModule {}
