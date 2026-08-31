import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserDTO {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;
}
