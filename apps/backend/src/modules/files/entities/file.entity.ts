import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('files')
export class File extends BaseEntity {
  @Column({ name: 'storage_key', type: 'varchar' })
  storageKey: string;

  @Column({ name: 'mime_type', type: 'varchar' })
  mimeType: string;

  @Column({ type: 'bigint' })
  size: number;
}
