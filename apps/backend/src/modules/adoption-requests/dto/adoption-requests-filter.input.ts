import { Field, InputType } from '@nestjs/graphql';

import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

import { BrazilianState } from 'src/common/enums/brazilian-state.enum';

import { AdoptionRequestStatus } from '../enums/adoption-request-status.enum';
import { AdoptionRequestOrderBy } from '../enums/adoption-request-order-by.enum';

@InputType()
export class AdoptionRequestsFilterInputDTO {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string;

  @Field(() => AdoptionRequestStatus, { nullable: true })
  @IsOptional()
  @IsEnum(AdoptionRequestStatus)
  status?: AdoptionRequestStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  animalId?: string;

  @Field(() => BrazilianState, { nullable: true })
  @IsOptional()
  @IsEnum(BrazilianState)
  state?: BrazilianState;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  city?: string;

  @Field({ defaultValue: 1 })
  @IsInt()
  @Min(1)
  page: number = 1;

  @Field({ defaultValue: 10 })
  @IsInt()
  @Min(1)
  limit: number = 10;

  @Field(() => AdoptionRequestOrderBy, { nullable: true })
  @IsOptional()
  @IsEnum(AdoptionRequestOrderBy)
  orderBy?: AdoptionRequestOrderBy;
}
