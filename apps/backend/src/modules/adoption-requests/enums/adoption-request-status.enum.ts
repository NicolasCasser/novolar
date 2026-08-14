import { registerEnumType } from '@nestjs/graphql';

export enum AdoptionRequestStatus {
  PENDING = 'PENDING',
  IN_ANALYSIS = 'IN_ANALYSIS',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELED = 'CANCELED',
}

registerEnumType(AdoptionRequestStatus, {
  name: 'AdoptionRequestStatus',
  description: 'Status of an adoption request.',
});
