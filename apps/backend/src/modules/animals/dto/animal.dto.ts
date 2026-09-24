import { Field, ObjectType } from '@nestjs/graphql';
import { BaseDTO } from 'src/common/dto/base.dto';
import { AnimalSpecies } from '../enums/animal-species.enum';
import { AnimalSex } from '../enums/animal-sex.enum';
import { AnimalSize } from '../enums/animal-size.enum';
import { BrazilianState } from 'src/common/enums/brazilian-state.enum';
import { AnimalStatus } from '../enums/animal-status.enum';
import { AnimalImageDTO } from './animal-image.dto';

@ObjectType()
export class AnimalDTO extends BaseDTO {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => AnimalSpecies)
  species: AnimalSpecies;

  @Field()
  breed: string;

  @Field(() => AnimalSex)
  sex: AnimalSex;

  @Field(() => AnimalSize)
  size: AnimalSize;

  @Field()
  color: string;

  @Field(() => BrazilianState)
  state: BrazilianState;

  @Field()
  city: string;

  @Field()
  ageInMonths: number;

  @Field()
  vaccinated: boolean;

  @Field()
  neutered: boolean;

  @Field(() => AnimalStatus)
  status: AnimalStatus;

  @Field(() => [AnimalImageDTO])
  images: AnimalImageDTO[];
}
