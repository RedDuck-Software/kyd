import { Column, Entity } from 'typeorm';
import { UuidEntity } from '../../common';

@Entity({ name: 'file' })
export class FileEntity extends UuidEntity {
  @Column({ type: 'varchar', nullable: true })
  remoteStorageId?: string;

  @Column({ type: 'varchar', nullable: true })
  uri?: string;

  @Column({ type: 'varchar', length: 64 })
  contentHash: string;

  @Column({ type: 'char', length: 5 })
  fileExtension: string;
}
