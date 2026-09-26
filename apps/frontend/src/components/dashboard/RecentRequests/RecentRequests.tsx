import { ChevronRight, Eye, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

import { RequestStatusBadge } from '../../ui/RequestStatusBadge/RequestStatusBadge';
import type { AdoptionRequestStatus } from '../../../utils/adoptionRequests';
import { formatDate } from '../../../utils/date';

import './RecentRequests.css';

export type RecentRequest = {
  id: string;
  applicantName: string;
  city: string;
  state: string;
  createdAt: string;
  status: AdoptionRequestStatus;
  animal: {
    name: string;
  };
};

interface RecentRequestsProps {
  requests: RecentRequest[];
  error: string;
}

export function RecentRequests({ requests, error }: RecentRequestsProps) {
  return (
    <section className="recent-requests">
      <div className="recent-requests-header">
        <div>
          <h2>Solicitações recentes</h2>

          <p>Acompanhe as últimas intenções de adoção.</p>
        </div>

        <button type="button" className="recent-requests-link">
          Ver todas
          <ChevronRight />
        </button>
      </div>

      {error ? (
        <p className="recent-requests-empty">{error}</p>
      ) : (
        <div className="recent-requests-table-wrapper">
          <table className="recent-requests-table">
            <thead>
              <tr>
                <th>Animal</th>
                <th>Interessado</th>
                <th>Cidade</th>
                <th>Data</th>
                <th>Status</th>
                <th aria-label="Ações" />
              </tr>
            </thead>

            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>
                    <span className="recent-requests-animal">
                      {request.animal.name}
                    </span>
                  </td>

                  <td>
                    <span className="recent-requests-muted">
                      {request.applicantName}
                    </span>
                  </td>

                  <td>
                    <span className="recent-requests-city">
                      <MapPin />
                      {request.city}, {request.state}
                    </span>
                  </td>

                  <td>
                    <span className="recent-requests-muted">
                      {formatDate(request.createdAt)}
                    </span>
                  </td>

                  <td>
                    <RequestStatusBadge status={request.status} />
                  </td>

                  <td>
                    <Link
                      className="recent-requests-action"
                      to={`/dashboard/solicitacoes/${request.id}`}
                      aria-label={`Ver solicitação de ${request.animal.name}`}
                    >
                      <Eye />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {requests.length === 0 && (
            <p className="recent-requests-empty">
              Nenhuma solicitação registrada.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
