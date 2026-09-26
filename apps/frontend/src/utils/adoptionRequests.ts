export type AdoptionRequestStatus =
  'PENDING' | 'IN_ANALYSIS' | 'APPROVED' | 'REJECTED' | 'CANCELED';

export const adoptionRequestStatusLabels: Record<
  AdoptionRequestStatus,
  string
> = {
  PENDING: 'Pendente',
  IN_ANALYSIS: 'Em análise',
  APPROVED: 'Aprovada',
  REJECTED: 'Rejeitada',
  CANCELED: 'Cancelada',
};

export const adoptionRequestStatuses: AdoptionRequestStatus[] = [
  'PENDING',
  'IN_ANALYSIS',
  'APPROVED',
  'REJECTED',
  'CANCELED',
];

// Reflete as regras do backend: pending e in_analysis podem ser movidos para
// analise, aprovacao ou rejeicao. Os status finais nao aceitam transicao.

const statusTransitions: Partial<
  Record<AdoptionRequestStatus, AdoptionRequestStatus[]>
> = {
  PENDING: ['IN_ANALYSIS', 'APPROVED', 'REJECTED'],
  IN_ANALYSIS: ['APPROVED', 'REJECTED'],
};

export function getAvailableStatusTransitions(
  status: AdoptionRequestStatus,
): AdoptionRequestStatus[] {
  return statusTransitions[status] ?? [];
}
