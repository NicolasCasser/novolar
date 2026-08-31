import { Field } from '@nestjs/graphql';

export abstract class BaseDTO {
  @Field()
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
