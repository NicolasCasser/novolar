import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

import { BrazilianState } from 'src/common/enums/brazilian-state.enum';
import { AnimalSex } from '../enums/animal-sex.enum';
import { AnimalSize } from '../enums/animal-size.enum';
import { AnimalSpecies } from '../enums/animal-species.enum';

@InputType()
export class AnimalsFilterInputDTO {
  @Field(() => Int, { defaultValue: 1 })
  @IsInt()
  @Min(1)
  page: number = 1;

  @Field(() => Int, { defaultValue: 8 })
  @IsInt()
  @IsPositive()
  limit: number = 8;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string;

  @Field(() => AnimalSpecies, { nullable: true })
  @IsOptional()
  @IsEnum(AnimalSpecies)
  species?: AnimalSpecies;

  @Field(() => AnimalSize, { nullable: true })
  @IsOptional()
  @IsEnum(AnimalSize)
  size?: AnimalSize;

  @Field(() => AnimalSex, { nullable: true })
  @IsOptional()
  @IsEnum(AnimalSex)
  sex?: AnimalSex;

  @Field(() => BrazilianState, { nullable: true })
  @IsOptional()
  @IsEnum(BrazilianState)
  state?: BrazilianState;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  city?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  minAgeInMonths?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  maxAgeInMonths?: number;
}
