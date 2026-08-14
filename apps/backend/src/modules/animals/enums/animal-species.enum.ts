import { registerEnumType } from '@nestjs/graphql';

export enum AnimalSpecies {
  DOG = 'DOG',
  CAT = 'CAT',
  BIRD = 'BIRD',
  RABBIT = 'RABBIT',
  OTHER = 'OTHER',
}

registerEnumType(AnimalSpecies, {
  name: 'AnimalSpecies',
  description: 'Species of the animal.',
});
