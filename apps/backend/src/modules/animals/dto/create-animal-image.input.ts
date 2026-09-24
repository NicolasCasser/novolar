import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export class CreateAnimalImageInputDTO {
  @Field()
  @IsUUID()
  @IsNotEmpty()
  fileId: string;
}
