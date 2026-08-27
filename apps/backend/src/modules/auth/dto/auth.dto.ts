import { Field, ObjectType } from '@nestjs/graphql';
import { UserDTO } from 'src/modules/users/dto/user.dto';

@ObjectType()
export class AuthDTO {
  @Field(() => UserDTO)
  user: UserDTO;

  @Field()
  accessToken: string;
}
