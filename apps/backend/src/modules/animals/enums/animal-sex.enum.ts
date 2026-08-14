import { registerEnumType } from '@nestjs/graphql';

export enum AnimalSex {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

registerEnumType(AnimalSex, {
  name: 'AnimalSex',
  description: 'Sex of the Animal.',
});
