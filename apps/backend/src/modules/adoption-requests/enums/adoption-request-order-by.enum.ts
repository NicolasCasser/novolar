import { registerEnumType } from '@nestjs/graphql';

export enum AdoptionRequestOrderBy {
  CREATED_AT_DESC = 'CREATED_AT_DESC',
  CREATED_AT_ASC = 'CREATED_AT_ASC',
}

registerEnumType(AdoptionRequestOrderBy, {
  name: 'AdoptionRequestOrderBy',
  description: 'Sorting options for the adoption requests list.',
});
