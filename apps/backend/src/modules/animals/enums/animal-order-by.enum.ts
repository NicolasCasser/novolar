import { registerEnumType } from '@nestjs/graphql';

export enum AnimalOrderBy {
  CREATED_AT_DESC = 'CREATED_AT_DESC',
  CREATED_AT_ASC = 'CREATED_AT_ASC',
}

registerEnumType(AnimalOrderBy, {
  name: 'AnimalOrderBy',
  description: 'Sorting options for the animals list.',
});
