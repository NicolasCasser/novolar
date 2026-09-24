import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Animal } from './animal.entity';
import { File } from 'src/modules/files/entities/file.entity';

@Entity('animal_images')
export class AnimalImage extends BaseEntity {
  @ManyToOne(() => Animal, (animal) => animal.images, { nullable: false })
  @JoinColumn({ name: 'animal_id' })
  animal: Animal;

  @Column({ name: 'animal_id', type: 'uuid' })
  animalId: string;

  @ManyToOne(() => File, { nullable: false })
  @JoinColumn({ name: 'file_id' })
  file: File;

  @Column({ name: 'file_id', type: 'uuid' })
  fileId: string;

  @Column({ name: 'is_primary', type: 'boolean' })
  isPrimary: boolean;
}
