import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Animal } from './animal.entity';

@Entity('animal_images')
export class AnimalImage extends BaseEntity {
  @ManyToOne(() => Animal, (animal) => animal.images, { nullable: false })
  @JoinColumn({ name: 'animal_id' })
  animal: Animal;

  @Column({ name: 'animal_id', type: 'uuid' })
  animalId: string;

  @Column({ type: 'varchar' })
  url: string;

  @Column({ name: 'is_primary', type: 'boolean' })
  isPrimary: boolean;
}
