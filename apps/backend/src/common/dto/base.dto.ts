import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export abstract class BaseDTO {
  @Field()
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
