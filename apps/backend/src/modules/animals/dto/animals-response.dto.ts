import { Field, Int, ObjectType } from '@nestjs/graphql';
import { AnimalDTO } from './animal.dto';
import { Animal } from '../entities/animal.entity';

@ObjectType()
export class AnimalsResponseDTO {
  @Field(() => [AnimalDTO])
  items: Animal[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  totalPages: number;
}
