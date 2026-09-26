import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  MoreHorizontal,
  XCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { ActionsMenu } from '../../ui/ActionsMenu/ActionsMenu';
import type { ActionMenuItem } from '../../ui/ActionsMenu/ActionsMenu';
import { RequestStatusBadge } from '../../ui/RequestStatusBadge/RequestStatusBadge';
import { formatDate } from '../../../utils/date';
import { getAvailableStatusTransitions } from '../../../utils/adoptionRequests';
import type { AdoptionRequestStatus } from '../../../utils/adoptionRequests';

import './RequestsTable.css';

// Rotulos e icones das transicoes, espelhando o RequestStatusBadge para que a
// lista e a tela de detalhe falem a mesma linguagem visual.

const statusActions: Record<
  string,
  { label: string; icon: typeof Clock; tone?: 'danger' }
> = {
  IN_ANALYSIS: { label: 'Iniciar análise', icon: Clock },
  APPROVED: { label: 'Aprovar', icon: CheckCircle },
  REJECTED: { label: 'Rejeitar', icon: XCircle, tone: 'danger' },
};

export type RequestListItem = {
  id: string;
  status: AdoptionRequestStatus;
  createdAt: string;
  applicantName: string;
  city: string;
  state: string;
  animal: {
    id: string;
    name: string;
  };
};

interface RequestsTableProps {
  items: RequestListItem[];
  total: number;
  page: number;
  totalPages: number;
  pageSize: number;
  loading: boolean;
  error: string;
  onPageChange: (page: number) => void;
  onView: (request: RequestListItem) => void;
  onStatusChange: (
    request: RequestListItem,
    next: AdoptionRequestStatus,
  ) => void;
}

function buildPageItems(
  page: number,
  totalPages: number,
): (number | 'ellipsis')[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: (number | 'ellipsis')[] = [1];

  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  if (start > 2) {
    pages.push('ellipsis');
  }

  for (let index = start; index <= end; index += 1) {
    pages.push(index);
  }

  if (end < totalPages - 1) {
    pages.push('ellipsis');
  }

  pages.push(totalPages);

  return pages;
}

export function RequestsTable({
  items,
  total,
  page,
  totalPages,
  pageSize,
  loading,
  error,
  onPageChange,
  onView,
  onStatusChange,
}: RequestsTableProps) {
  const firstItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, total);

  return (
    <section className="requests-table-card">
      <h2 className="requests-table-title">Lista de solicitações</h2>

      {error ? (
        <p className="requests-table-message">{error}</p>
      ) : (
        <div className="requests-table-wrapper">
          <table className="requests-table">
            <thead>
              <tr>
                <th>Animal</th>
                <th>Interessado</th>
                <th>Cidade</th>
                <th>Data da solicitação</th>
                <th>Status</th>
                <th aria-label="Ações" />
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="requests-table-message">
                    Carregando solicitações...
                  </td>
                </tr>
              )}

              {!loading &&
                items.map((item) => {
                  const actionItems: ActionMenuItem[] = [
                    {
                      label: 'Ver detalhes',
                      icon: Eye,
                      onSelect: () => onView(item),
                    },
                    ...getAvailableStatusTransitions(item.status).map(
                      (next): ActionMenuItem => {
                        const action = statusActions[next];

                        return {
                          label: action.label,
                          icon: action.icon,
                          tone: action.tone,
                          onSelect: () => onStatusChange(item, next),
                        };
                      },
                    ),
                  ];

                  return (
                    <tr key={item.id}>
                      <td>
                        <Link
                          className="requests-table-animal"
                          to={`/dashboard/solicitacoes/${item.id}`}
                        >
                          {item.animal.name}
                        </Link>
                      </td>

                      <td>{item.applicantName}</td>

                      <td>
                        <span className="requests-table-muted">
                          {item.city}, {item.state}
                        </span>
                      </td>

                      <td>
                        <span className="requests-table-muted">
                          {formatDate(item.createdAt)}
                        </span>
                      </td>

                      <td>
                        <RequestStatusBadge status={item.status} withIcon />
                      </td>

                      <td>
                        <ActionsMenu
                          label={`Mais ações para a solicitação de ${item.animal.name}`}
                          icon={MoreHorizontal}
                          items={actionItems}
                        />
                      </td>
                    </tr>
                  );
                })}

              {!loading && !error && items.length === 0 && (
                <tr>
                  <td colSpan={6} className="requests-table-message">
                    Nenhuma solicitação encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="requests-table-footer">
        <span className="requests-table-count">
          Exibindo {firstItem}-{lastItem} de {total} solicitações
        </span>

        <div className="requests-table-pages">
          <button
            type="button"
            className="requests-table-nav"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="Página anterior"
          >
            <ChevronLeft />
          </button>

          {buildPageItems(page, totalPages).map((item, index) =>
            item === 'ellipsis' ? (
              <span
                key={`ellipsis-${index}`}
                className="requests-table-ellipsis"
                aria-hidden="true"
              >
                ...
              </span>
            ) : (
              <button
                key={item}
                type="button"
                className={item === page ? 'active' : ''}
                onClick={() => onPageChange(item)}
                aria-label={`Página ${item}`}
                aria-current={item === page}
              >
                {item}
              </button>
            ),
          )}

          <button
            type="button"
            className="requests-table-nav"
            disabled={page === totalPages || totalPages === 0}
            onClick={() => onPageChange(page + 1)}
            aria-label="Próxima página"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}
