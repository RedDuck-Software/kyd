import { Column, Entity, PrimaryColumn } from 'typeorm';
import { TimeKnownEntity } from '../../common';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'auction_metadata' })
export class AuctionMetadataEntity extends TimeKnownEntity {
  @PrimaryColumn({ type: 'varchar' })
  @ApiProperty({
    type: String,
    description: 'Id of entity',
    example: '356xSKGa5hRhIDY',
  })
  auctionId: string;

  @PrimaryColumn({ type: 'varchar' })
  @ApiProperty({
    type: String,
    description: 'Token ID of the auction',
    example: '1',
  })
  tokenId: string;

  @Column({ type: 'varchar' })
  @ApiProperty({
    type: String,
    description: 'Name of the auction',
    example: 'Auction name',
  })
  name: string;

  @Column({ type: 'varchar' })
  @ApiProperty({
    type: String,
    description: 'Description of the auction',
    example: 'Auction description',
  })
  description: string;

  @Column({ type: 'varchar' })
  @ApiProperty({
    type: String,
    description: 'Image URL of the auction',
    example: 'https://example.com/image.jpg',
  })
  uri: string;
}
