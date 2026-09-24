import { InputType, PartialType } from '@nestjs/graphql';
import { CreateAnimalInputDTO } from './create-animal.input';

@InputType()
export class UpdateAnimalInputDTO extends PartialType(CreateAnimalInputDTO) {}
