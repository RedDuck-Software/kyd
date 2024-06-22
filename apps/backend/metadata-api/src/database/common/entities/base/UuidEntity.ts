import { PrimaryGeneratedColumn } from 'typeorm';
import { TimeKnownEntity } from './TimeKnownEntity';
import { ApiProperty } from '@nestjs/swagger';

export class UuidEntity extends TimeKnownEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    type: String,
    description: 'Id of entity',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;
}
