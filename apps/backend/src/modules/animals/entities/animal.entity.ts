import { SoftDeleteEntity } from 'src/common/entities/soft-delete.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AnimalSpecies } from '../enums/animal-species.enum';
import { AnimalSex } from '../enums/animal-sex.enum';
import { AnimalSize } from '../enums/animal-size.enum';
import { BrazilianState } from 'src/common/enums/brazilian-state.enum';
import { AnimalStatus } from '../enums/animal-status.enum';
import { AnimalImage } from './animal-image.entity';
import { AdoptionRequest } from 'src/modules/adoption-requests/entities/adoption-request.entity';

@Entity('animals')
export class Animal extends SoftDeleteEntity {
  @ManyToOne(() => User, (user) => user.animals, { nullable: false })
  @JoinColumn({ name: 'created_by_user_id' })
  user: User;

  @Column({ name: 'created_by_user_id', type: 'uuid' })
  createdByUserId: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: AnimalSpecies })
  species: AnimalSpecies;

  @Column({ type: 'varchar' })
  breed: string;

  @Column({ type: 'enum', enum: AnimalSex })
  sex: AnimalSex;

  @Column({ type: 'enum', enum: AnimalSize })
  size: AnimalSize;

  @Column({ type: 'varchar' })
  color: string;

  @Column({ type: 'enum', enum: BrazilianState })
  state: BrazilianState;

  @Column({ type: 'varchar' })
  city: string;

  @Column({ name: 'age_in_months', type: 'int' })
  ageInMonths: number;

  @Column({ type: 'boolean' })
  vaccinated: boolean;

  @Column({ type: 'boolean' })
  neutered: boolean;

  @Column({ type: 'enum', enum: AnimalStatus })
  status: AnimalStatus;

  @OneToMany(() => AnimalImage, (image) => image.animal)
  images: AnimalImage[];

  @OneToMany(() => AdoptionRequest, (adoptionRequest) => adoptionRequest.animal)
  adoptionRequests: AdoptionRequest[];
}
