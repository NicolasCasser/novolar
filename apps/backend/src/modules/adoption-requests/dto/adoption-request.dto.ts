import { Field, ObjectType } from '@nestjs/graphql';
import { BaseDTO } from 'src/common/dto/base.dto';
import { BrazilianState } from 'src/common/enums/brazilian-state.enum';
import { AnimalDTO } from 'src/modules/animals/dto/animal.dto';
import { Animal } from 'src/modules/animals/entities/animal.entity';
import { AdoptionRequestStatus } from '../enums/adoption-request-status.enum';

@ObjectType()
export class AdoptionRequestDTO extends BaseDTO {
  @Field()
  animalId: string;

  @Field(() => AnimalDTO)
  animal: Animal;

  @Field()
  applicantName: string;

  @Field()
  applicantEmail: string;

  @Field()
  applicantPhone: string;

  @Field(() => BrazilianState)
  state: BrazilianState;

  @Field()
  city: string;

  @Field()
  message: string;

  @Field(() => AdoptionRequestStatus)
  status: AdoptionRequestStatus;
}
