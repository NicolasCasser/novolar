import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  MoreHorizontal,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { AnimalStatusBadge } from '../../ui/AnimalStatusBadge/AnimalStatusBadge';
import { SpeciesBadge } from '../../ui/SpeciesBadge/SpeciesBadge';
import type { AnimalSpecies, AnimalStatus } from '../../../utils/animals';
import { formatDate } from '../../../utils/date';

import './AnimalsTable.css';

export type AnimalListItem = {
  id: string;
  name: string;
  species: AnimalSpecies;
  age: string;
  city: string;
  state: string;
  createdAt: string;
  status: AnimalStatus;
  imageUrl: string;
};

interface AnimalsTableProps {
  items: AnimalListItem[];
  total: number;
  page: number;
  totalPages: number;
  pageSize: number;
  loading: boolean;
  error: string;
  onPageChange: (page: number) => void;
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

export function AnimalsTable({
  items,
  total,
  page,
  totalPages,
  pageSize,
  loading,
  error,
  onPageChange,
}: AnimalsTableProps) {
  const firstItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, total);

  return (
    <section className="animals-table-card">
      <h2 className="animals-table-title">Lista de animais</h2>

      {error ? (
        <p className="animals-table-message">{error}</p>
      ) : (
        <div className="animals-table-wrapper">
          <table className="animals-table">
            <thead>
              <tr>
                <th>Foto</th>
                <th>Nome</th>
                <th>Espécie</th>
                <th>Localização</th>
                <th>Idade</th>
                <th>Status</th>
                <th>Criado em</th>
                <th aria-label="Ações" />
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={8} className="animals-table-message">
                    Carregando animais...
                  </td>
                </tr>
              )}

              {!loading &&
                items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="animals-table-photo">
                        <img src={item.imageUrl} alt={item.name} />
                      </div>
                    </td>

                    <td>
                      <Link
                        className="animals-table-name"
                        to={`/animals/${item.id}`}
                      >
                        {item.name}
                      </Link>
                    </td>

                    <td>
                      <SpeciesBadge species={item.species} />
                    </td>

                    <td>
                      <span className="animals-table-muted">
                        <MapPin />
                        {item.city}, {item.state}
                      </span>
                    </td>

                    <td>
                      <span className="animals-table-muted">
                        <Calendar />
                        {item.age}
                      </span>
                    </td>

                    <td>
                      <AnimalStatusBadge status={item.status} />
                    </td>

                    <td>
                      <span className="animals-table-muted">
                        <Clock />
                        {formatDate(item.createdAt)}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="animals-table-action"
                        aria-label={`Mais ações para ${item.name}`}
                      >
                        <MoreHorizontal />
                      </button>
                    </td>
                  </tr>
                ))}

              {!loading && items.length === 0 && (
                <tr>
                  <td colSpan={8} className="animals-table-message">
                    Nenhum animal encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="animals-table-footer">
        <span className="animals-table-count">
          Exibindo {firstItem}-{lastItem} de {total} animais
        </span>

        <div className="animals-table-pages">
          <button
            type="button"
            className="animals-table-nav"
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
                className="animals-table-ellipsis"
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
            className="animals-table-nav"
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
