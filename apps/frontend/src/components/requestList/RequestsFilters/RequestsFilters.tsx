import { Filter, Search } from 'lucide-react';

import { adoptionRequestStatusLabels } from '../../../utils/adoptionRequests';
import type { AdoptionRequestStatus } from '../../../utils/adoptionRequests';
import { states } from '../../../utils/locations';
import type { BrazilianState } from '../../../utils/locations';

import './RequestsFilters.css';

export type RequestFilters = {
  search: string;
  status: AdoptionRequestStatus | '';
  animalId: string;
  state: BrazilianState | '';
  city: string;
};

interface RequestsFiltersProps {
  filters: RequestFilters;
  animals: { id: string; name: string }[];
  cities: string[];
  citiesLoading: boolean;
  onChange: (field: keyof RequestFilters, value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
}

export function RequestsFilters({
  filters,
  animals,
  cities,
  citiesLoading,
  onChange,
  onSubmit,
  onClear,
}: RequestsFiltersProps) {
  const statuses: AdoptionRequestStatus[] = [
    'PENDING',
    'IN_ANALYSIS',
    'APPROVED',
    'REJECTED',
    'CANCELED',
  ];

  return (
    <form
      className="requests-filters"
      onSubmit={(event) => {
        event.preventDefault();

        onSubmit();
      }}
    >
      <div className="requests-filters-grid">
        <div className="requests-filter requests-filter--search">
          <label htmlFor="requestsSearch">
            BUSCAR POR INTERESSADO OU ANIMAL
          </label>

          <div className="requests-filter-search">
            <Search />

            <input
              id="requestsSearch"
              type="text"
              placeholder="Ex: João Silva, Thor..."
              value={filters.search}
              onChange={(event) => onChange('search', event.target.value)}
            />
          </div>
        </div>

        <div className="requests-filter">
          <label htmlFor="requestsStatus">STATUS</label>

          <select
            id="requestsStatus"
            value={filters.status}
            onChange={(event) =>
              onChange('status', event.target.value as RequestFilters['status'])
            }
          >
            <option value="">Todos</option>

            {statuses.map((status) => (
              <option key={status} value={status}>
                {adoptionRequestStatusLabels[status]}
              </option>
            ))}
          </select>
        </div>

        <div className="requests-filter">
          <label htmlFor="requestsAnimal">ANIMAL</label>

          <select
            id="requestsAnimal"
            value={filters.animalId}
            onChange={(event) => onChange('animalId', event.target.value)}
          >
            <option value="">Selecione</option>

            {animals.map((animal) => (
              <option key={animal.id} value={animal.id}>
                {animal.name}
              </option>
            ))}
          </select>
        </div>

        <div className="requests-filter">
          <label htmlFor="requestsState">ESTADO</label>

          <select
            id="requestsState"
            value={filters.state}
            onChange={(event) =>
              onChange('state', event.target.value as RequestFilters['state'])
            }
          >
            <option value="">Todos</option>

            {states.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="requests-filter">
          <label htmlFor="requestsCity">CIDADE</label>

          <select
            id="requestsCity"
            value={filters.city}
            disabled={!filters.state || citiesLoading}
            onChange={(event) => onChange('city', event.target.value)}
          >
            <option value="">
              {!filters.state
                ? 'Selecione o estado primeiro'
                : citiesLoading
                  ? 'Carregando cidades...'
                  : 'Selecione'}
            </option>

            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="button"
        className="requests-filters-clear"
        onClick={onClear}
      >
        <Filter />
        Limpar filtros
      </button>
    </form>
  );
}
