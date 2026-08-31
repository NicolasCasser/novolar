import { Field } from '@nestjs/graphql';
import { BaseDTO } from './base.dto';

export abstract class SoftDeleteDTO extends BaseDTO {
  @Field()
  deletedAt?: Date;
}
