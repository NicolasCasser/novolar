import { Filter, Search } from 'lucide-react';

import { sexLabels, sizeLabels, speciesLabels } from '../../../utils/animals';
import type {
  AnimalSex,
  AnimalSize,
  AnimalSpecies,
  AnimalStatus,
} from '../../../utils/animals';
import { statusLabels } from '../../../utils/animals';
import { states } from '../../../utils/locations';
import type { BrazilianState } from '../../../utils/locations';

import './AnimalsFilters.css';

export type AnimalFilters = {
  search: string;
  species: AnimalSpecies | '';
  size: AnimalSize | '';
  sex: AnimalSex | '';
  status: AnimalStatus | '';
  state: BrazilianState | '';
  city: string;
};

interface AnimalsFiltersProps {
  filters: AnimalFilters;
  cities: string[];
  citiesLoading: boolean;
  onChange: (field: keyof AnimalFilters, value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
}

const speciesOptions: AnimalSpecies[] = [
  'DOG',
  'CAT',
  'BIRD',
  'RABBIT',
  'OTHER',
];

const sizeOptions: AnimalSize[] = ['SMALL', 'MEDIUM', 'LARGE'];

const sexOptions: AnimalSex[] = ['MALE', 'FEMALE'];

const statusOptions: AnimalStatus[] = ['AVAILABLE', 'ADOPTED'];

export function AnimalsFilters({
  filters,
  cities,
  citiesLoading,
  onChange,
  onSubmit,
  onClear,
}: AnimalsFiltersProps) {
  return (
    <form
      className="animals-list-filters"
      onSubmit={(event) => {
        event.preventDefault();

        onSubmit();
      }}
    >
      <div className="animals-list-filters-row animals-list-filters-row--main">
        <div className="animals-list-filter animals-list-filter--search">
          <label htmlFor="animalsSearch">BUSCAR POR NOME OU CÓDIGO</label>

          <div className="animals-list-filter-search">
            <Search />

            <input
              id="animalsSearch"
              type="text"
              placeholder="Buscar por nome..."
              value={filters.search}
              onChange={(event) => onChange('search', event.target.value)}
            />
          </div>
        </div>

        <div className="animals-list-filter">
          <label htmlFor="animalsSpecies">ESPÉCIE</label>

          <select
            id="animalsSpecies"
            value={filters.species}
            onChange={(event) =>
              onChange(
                'species',
                event.target.value as AnimalFilters['species'],
              )
            }
          >
            <option value="">Todas</option>

            {speciesOptions.map((species) => (
              <option key={species} value={species}>
                {speciesLabels[species]}
              </option>
            ))}
          </select>
        </div>

        <div className="animals-list-filter">
          <label htmlFor="animalsSize">PORTE</label>

          <select
            id="animalsSize"
            value={filters.size}
            onChange={(event) =>
              onChange('size', event.target.value as AnimalFilters['size'])
            }
          >
            <option value="">Todos</option>

            {sizeOptions.map((size) => (
              <option key={size} value={size}>
                {sizeLabels[size]}
              </option>
            ))}
          </select>
        </div>

        <div className="animals-list-filter">
          <label htmlFor="animalsSex">SEXO</label>

          <select
            id="animalsSex"
            value={filters.sex}
            onChange={(event) =>
              onChange('sex', event.target.value as AnimalFilters['sex'])
            }
          >
            <option value="">Ambos</option>

            {sexOptions.map((sex) => (
              <option key={sex} value={sex}>
                {sexLabels[sex]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="animals-list-filters-row animals-list-filters-row--secondary">
        <div className="animals-list-filter">
          <label htmlFor="animalsStatus">STATUS</label>

          <select
            id="animalsStatus"
            value={filters.status}
            onChange={(event) =>
              onChange('status', event.target.value as AnimalFilters['status'])
            }
          >
            <option value="">Todos</option>

            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
        </div>

        <div className="animals-list-filter">
          <label htmlFor="animalsState">ESTADO</label>

          <select
            id="animalsState"
            value={filters.state}
            onChange={(event) =>
              onChange('state', event.target.value as AnimalFilters['state'])
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

        <div className="animals-list-filter">
          <label htmlFor="animalsCity">CIDADE</label>

          <select
            id="animalsCity"
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

        <button
          type="button"
          className="animals-list-filters-clear"
          onClick={onClear}
        >
          <Filter />
          Limpar filtros
        </button>
      </div>
    </form>
  );
}
