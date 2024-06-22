import { Column, Entity } from 'typeorm';
import { UuidEntity } from '../../common';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'auction_metadata' })
export class AuctionMetadataEntity extends UuidEntity {
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
