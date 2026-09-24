import { Field, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateNested,
  IsArray,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

import { BrazilianState } from 'src/common/enums/brazilian-state.enum';
import { AnimalSpecies } from '../enums/animal-species.enum';
import { AnimalSex } from '../enums/animal-sex.enum';
import { AnimalSize } from '../enums/animal-size.enum';
import { CreateAnimalImageInputDTO } from './create-animal-image.input';

@InputType()
export class CreateAnimalInputDTO {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field(() => AnimalSpecies)
  @IsEnum(AnimalSpecies)
  species: AnimalSpecies;

  @Field()
  @IsString()
  @IsNotEmpty()
  breed: string;

  @Field(() => AnimalSex)
  @IsEnum(AnimalSex)
  sex: AnimalSex;

  @Field(() => AnimalSize)
  @IsEnum(AnimalSize)
  size: AnimalSize;

  @Field()
  @IsString()
  @IsNotEmpty()
  color: string;

  @Field(() => BrazilianState)
  @IsEnum(BrazilianState)
  state: BrazilianState;

  @Field()
  @IsString()
  @IsNotEmpty()
  city: string;

  @Field()
  @IsInt()
  @Min(0)
  ageInMonths: number;

  @Field()
  @IsBoolean()
  vaccinated: boolean;

  @Field()
  @IsBoolean()
  neutered: boolean;

  @Field(() => [CreateAnimalImageInputDTO])
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateAnimalImageInputDTO)
  images: CreateAnimalImageInputDTO[];
}
