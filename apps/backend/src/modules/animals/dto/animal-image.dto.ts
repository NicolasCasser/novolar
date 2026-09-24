import { Field, ObjectType } from '@nestjs/graphql';

import { BaseDTO } from 'src/common/dto/base.dto';

@ObjectType()
export class AnimalImageDTO extends BaseDTO {
  @Field()
  url: string;

  @Field()
  isPrimary: boolean;
}
