import {
  adoptionRequestStatusLabels,
  adoptionRequestStatuses,
  getAvailableStatusTransitions,
} from '../../../utils/adoptionRequests';
import type { AdoptionRequestStatus } from '../../../utils/adoptionRequests';

import './StatusManager.css';

interface StatusManagerProps {
  status: AdoptionRequestStatus;
  loading: boolean;
  error: string;
  onStatusChange: (next: AdoptionRequestStatus) => void;
}

export function StatusManager({
  status,
  loading,
  error,
  onStatusChange,
}: StatusManagerProps) {
  const available = getAvailableStatusTransitions(status);

  return (
    <section className="status-manager">
      <h2 className="status-manager-title">Gerenciar Status</h2>

      <p className="status-manager-description">
        Altere o status da solicitação após análise dos dados.
      </p>

      <label className="status-manager-label" htmlFor="requestStatus">
        Status da solicitação
      </label>

      <select
        id="requestStatus"
        className="status-manager-select"
        value={status}
        disabled={loading || available.length === 0}
        onChange={(event) =>
          onStatusChange(event.target.value as AdoptionRequestStatus)
        }
      >
        {adoptionRequestStatuses.map((option) => (
          <option
            key={option}
            value={option}
            disabled={option !== status && !available.includes(option)}
          >
            {adoptionRequestStatusLabels[option]}
          </option>
        ))}
      </select>

      {available.length === 0 && !loading && (
        <p className="status-manager-hint">
          Este é um status final e não aceita outras transições.
        </p>
      )}

      {error && <p className="status-manager-error">{error}</p>}
    </section>
  );
}
