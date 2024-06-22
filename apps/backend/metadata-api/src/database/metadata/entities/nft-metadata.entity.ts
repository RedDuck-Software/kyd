import { Column, Entity } from 'typeorm';
import { UuidEntity } from '../../common';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'nft_metadata' })
export class NftMetadataEntity extends UuidEntity {
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
