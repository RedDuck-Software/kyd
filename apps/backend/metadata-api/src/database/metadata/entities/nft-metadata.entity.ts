import { Column, Entity, PrimaryColumn } from 'typeorm';
import { TimeKnownEntity } from '../../common';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'nft_metadata' })
export class NftMetadataEntity extends TimeKnownEntity {
  @PrimaryColumn({ type: 'varchar' })
  @ApiProperty({
    type: String,
    description: 'Id of entity',
    example: '356xSKGa5hRhIDY',
  })
  nftId: string;

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
    description: 'Url of the NFT image',
    example: 'https://example.com/image.jpg',
  })
  imageUrl: string;

  @Column({ type: 'varchar' })
  @ApiProperty({
    type: String,
    description: 'Description of the NFT',
    example: 'NFT description',
  })
  description: string;
}
