import { statusLabels } from '../../../utils/animals';
import type { AnimalStatus } from '../../../utils/animals';

import './AnimalStatusBadge.css';

interface AnimalStatusBadgeProps {
  status: AnimalStatus;
}

export function AnimalStatusBadge({ status }: AnimalStatusBadgeProps) {
  return (
    <span className={`animal-status animal-status--${status.toLowerCase()}`}>
      {statusLabels[status]}
    </span>
  );
}
