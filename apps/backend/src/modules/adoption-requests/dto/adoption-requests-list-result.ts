import { Field, Int, ObjectType } from '@nestjs/graphql';

import { AdoptionRequestDTO } from './adoption-request.dto';

@ObjectType()
export class AdoptionRequestsListResult {
  @Field(() => [AdoptionRequestDTO])
  items: AdoptionRequestDTO[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  totalPages: number;
}
