import { Ban, CheckCircle, Clock, XCircle } from 'lucide-react';

import { adoptionRequestStatusLabels } from '../../../utils/adoptionRequests';
import type { AdoptionRequestStatus } from '../../../utils/adoptionRequests';

import './RequestStatusBadge.css';

const statusIcons = {
  PENDING: Clock,
  IN_ANALYSIS: Clock,
  APPROVED: CheckCircle,
  REJECTED: XCircle,
  CANCELED: Ban,
} satisfies Record<AdoptionRequestStatus, typeof Clock>;

interface RequestStatusBadgeProps {
  status: AdoptionRequestStatus;
  withIcon?: boolean;
}

export function RequestStatusBadge({
  status,
  withIcon = false,
}: RequestStatusBadgeProps) {
  const Icon = statusIcons[status];

  return (
    <span
      className={`request-status request-status--${status.toLowerCase()} ${
        withIcon ? 'request-status--with-icon' : ''
      }`}
    >
      {withIcon && <Icon />}

      {adoptionRequestStatusLabels[status]}
    </span>
  );
}
