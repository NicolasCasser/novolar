import { MapPin } from 'lucide-react';

import { statusLabels } from '../../../utils/animals';
import type { AnimalStatus } from '../../../utils/animals';

import './AnimalSummary.css';

interface AnimalSummaryProps {
  name: string;
  city: string;
  state: string;
  status: AnimalStatus;
}

export function AnimalSummary({
  name,
  city,
  state,
  status,
}: AnimalSummaryProps) {
  return (
    <div className="animal-summary">
      <div className="animal-summary-header">
        <div className="animal-summary-identity">
          <h1>{name}</h1>

          <span className="animal-summary-location">
            <MapPin />
            {city} - {state}
          </span>
        </div>

        <span
          className={`animal-summary-status ${
            status === 'AVAILABLE' ? 'available' : 'adopted'
          }`}
        >
          Status: {statusLabels[status]}
        </span>
      </div>

      <div className="animal-summary-divider" />
    </div>
  );
}
