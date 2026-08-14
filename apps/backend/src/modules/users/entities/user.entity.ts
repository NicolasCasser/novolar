import { SoftDeleteEntity } from 'src/common/entities/soft-delete.entity';
import { Animal } from 'src/modules/animals/entities/animal.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('users')
export class User extends SoftDeleteEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @OneToMany(() => Animal, (animal) => animal.user)
  animals: Animal[];
}
