import { BaseEntity } from 'src/common/entities/base.entity';
import { BrazilianState } from 'src/common/enums/brazilian-state.enum';
import { Animal } from 'src/modules/animals/entities/animal.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AdoptionRequestStatus } from '../enums/adoption-request-status.enum';

@Entity('adoption_requests')
export class AdoptionRequest extends BaseEntity {
  @ManyToOne(() => Animal, (animal) => animal.adoptionRequests, {
    nullable: false,
  })
  @JoinColumn({ name: 'animal_id' })
  animal: Animal;

  @Column({ name: 'animal_id', type: 'uuid' })
  animalId: string;

  @Column({ name: 'applicant_name', type: 'varchar' })
  applicantName: string;

  @Column({ name: 'applicant_email', type: 'varchar' })
  applicantEmail: string;

  @Column({ name: 'applicant_phone', type: 'varchar' })
  applicantPhone: string;

  @Column({ type: 'enum', enum: BrazilianState })
  state: BrazilianState;

  @Column({ type: 'varchar' })
  city: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'enum', enum: AdoptionRequestStatus })
  status: AdoptionRequestStatus;
}
