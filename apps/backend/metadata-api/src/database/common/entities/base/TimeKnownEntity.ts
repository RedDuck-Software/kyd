import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class TimeKnownEntity {
  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP()',
  })
  @ApiProperty({
    type: String,
    description: 'Creation date',
    example: '2021-09-01T00:00:00.000Z',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP()',
    onUpdate: 'CURRENT_TIMESTAMP()',
  })
  @ApiProperty({
    type: String,
    description: 'Update date',
    example: '2021-09-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
