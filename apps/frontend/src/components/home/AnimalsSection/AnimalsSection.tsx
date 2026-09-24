import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useState } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

import './AnimalsSection.css';
import { AnimalCard } from './AnimalCard/AnimalCard';

type Animal = {
  id: string;
  name: string;
  breed: string;
  species: 'DOG' | 'CAT' | 'BIRD' | 'RABBIT' | 'OTHER';
  ageInMonths: number;
  city: string;
  state: string;
  status: 'AVAILABLE' | 'ADOPTED';
  images: {
    id: string;
    url: string;
    isPrimary: boolean;
  }[];
};

type AnimalSize = 'SMALL' | 'MEDIUM' | 'LARGE';

type AnimalSex = 'MALE' | 'FEMALE';

type AgeFilter = '' | 'PUPPY' | 'YOUNG' | 'ADULT' | 'SENIOR';

type BrazilianState =
  | 'AC'
  | 'AL'
  | 'AP'
  | 'AM'
  | 'BA'
  | 'CE'
  | 'DF'
  | 'ES'
  | 'GO'
  | 'MA'
  | 'MT'
  | 'MS'
  | 'MG'
  | 'PA'
  | 'PB'
  | 'PR'
  | 'PE'
  | 'PI'
  | 'RJ'
  | 'RN'
  | 'RS'
  | 'RO'
  | 'RR'
  | 'SC'
  | 'SP'
  | 'SE'
  | 'TO';

type AnimalsData = {
  animals: {
    items: Animal[];
    total: number;
    page: number;
    totalPages: number;
  };
};

type AnimalsVariables = {
  filter: {
    page: number;
    limit: number;
    search?: string;
    species?: Animal['species'];
    size?: AnimalSize;
    sex?: AnimalSex;
    state?: BrazilianState;
    city?: string;
    minAgeInMonths?: number;
    maxAgeInMonths?: number;
  };
};

type CitiesData = {
  cities: string[];
};

type CitiesVariables = {
  state: BrazilianState;
};

const PAGE_SIZE = 10;

const ANIMALS: TypedDocumentNode<AnimalsData, AnimalsVariables> = gql`
  query Animals($filter: AnimalsFilterInputDTO) {
    animals(filter: $filter) {
      items {
        id
        name
        breed
        species
        ageInMonths
        city
        state
        status
        images {
          id
          url
          isPrimary
        }
      }
      total
      page
      totalPages
    }
  }
`;

const CITIES: TypedDocumentNode<CitiesData, CitiesVariables> = gql`
  query Cities($state: BrazilianState!) {
    cities(state: $state)
  }
`;

const API_URL = import.meta.env.VITE_API_URL.replace('/graphql', '');

const speciesLabels = {
  DOG: 'Cachorro',
  CAT: 'Gato',
  BIRD: 'Ave',
  RABBIT: 'Coelho',
  OTHER: 'Outro',
};

const sizeLabels = {
  SMALL: 'Pequeno',
  MEDIUM: 'Médio',
  LARGE: 'Grande',
};

const sexLabels = {
  MALE: 'Macho',
  FEMALE: 'Fêmea',
};

const ageFilters: Record<
  Exclude<AgeFilter, ''>,
  {
    minAgeInMonths?: number;
    maxAgeInMonths?: number;
  }
> = {
  PUPPY: {
    maxAgeInMonths: 11,
  },
  YOUNG: {
    minAgeInMonths: 12,
    maxAgeInMonths: 35,
  },
  ADULT: {
    minAgeInMonths: 36,
    maxAgeInMonths: 83,
  },
  SENIOR: {
    minAgeInMonths: 84,
  },
};

const states: { value: BrazilianState; label: string }[] = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
];

function formatAge(ageInMonths: number): string {
  if (ageInMonths < 12) {
    return `${ageInMonths} ${ageInMonths === 1 ? 'mês' : 'meses'}`;
  }

  const years = Math.floor(ageInMonths / 12);
  const months = ageInMonths % 12;

  if (months === 0) {
    return `${years} ${years === 1 ? 'ano' : 'anos'}`;
  }

  return `${years} ${years === 1 ? 'ano' : 'anos'} e ${months} ${
    months === 1 ? 'mês' : 'meses'
  }`;
}

function AnimalsSection() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const [species, setSpecies] = useState<Animal['species'] | ''>('');

  const [size, setSize] = useState<AnimalSize | ''>('');

  const [sex, setSex] = useState<AnimalSex | ''>('');

  const [age, setAge] = useState<AgeFilter>('');

  const [state, setState] = useState<BrazilianState | ''>('');

  const [city, setCity] = useState('');

  const ageFilter = age ? ageFilters[age] : {};

  const { data: citiesData, loading: citiesLoading } = useQuery(CITIES, {
    variables: {
      state: state as BrazilianState,
    },
    skip: !state,
  });

  const cities = citiesData?.cities ?? [];

  const { data, loading, error } = useQuery(ANIMALS, {
    variables: {
      filter: {
        page: currentPage,
        limit: PAGE_SIZE,
        search: search || undefined,
        species: species || undefined,
        size: size || undefined,
        sex: sex || undefined,
        state: state || undefined,
        city: city.trim() || undefined,
        minAgeInMonths: ageFilter.minAgeInMonths,
        maxAgeInMonths: ageFilter.maxAgeInMonths,
      },
    },
  });

  const animals = data?.animals.items ?? [];
  const totalPages = data?.animals.totalPages ?? 0;

  const handleSearch = () => {
    setCurrentPage(1);
    setSearch(searchInput.trim());
  };

  const handleSpeciesChange = (value: Animal['species'] | '') => {
    setCurrentPage(1);
    setSpecies(value);
  };

  const handleSizeChange = (value: AnimalSize | '') => {
    setCurrentPage(1);
    setSize(value);
  };

  const handleSexChange = (value: AnimalSex | '') => {
    setCurrentPage(1);
    setSex(value);
  };

  const handleAgeChange = (value: AgeFilter) => {
    setCurrentPage(1);
    setAge(value);
  };

  const handleStateChange = (value: BrazilianState | '') => {
    setCurrentPage(1);
    setState(value);
    setCity('');
  };

  const handleCityChange = (value: string) => {
    setCurrentPage(1);
    setCity(value);
  };

  const handleClearFilters = () => {
    setCurrentPage(1);
    setSearchInput('');
    setSearch('');
    setSpecies('');
    setSize('');
    setSex('');
    setAge('');
    setState('');
    setCity('');
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    setCurrentPage(page);
  };

  return (
    <section className="animals" id="animals">
      <div className="animals-search">
        <div className="animals-search-input">
          <Search />

          <input
            type="text"
            placeholder="Busque por nome, raça ou palavras-chave..."
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
        </div>

        <button type="button" onClick={handleSearch}>
          <Search />
          Buscar Pet
        </button>
      </div>

      <div className="animals-filters">
        <div className="animals-filters-header">
          <span className="filters-label">
            <Filter />
            Filtrar por:
          </span>

          <button
            type="button"
            className="filters-toggle"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <Filter />
            Filtros
          </button>
        </div>

        <div className={`animals-filters-content ${filtersOpen ? 'open' : ''}`}>
          <div className="animal-filter">
            <label htmlFor="species">ESPÉCIE</label>

            <select
              id="species"
              value={species}
              onChange={(event) =>
                handleSpeciesChange(
                  event.target.value as Animal['species'] | '',
                )
              }
            >
              <option value="">Todas as espécies</option>
              <option value="DOG">{speciesLabels.DOG}</option>
              <option value="CAT">{speciesLabels.CAT}</option>
              <option value="BIRD">{speciesLabels.BIRD}</option>
              <option value="RABBIT">{speciesLabels.RABBIT}</option>
              <option value="OTHER">{speciesLabels.OTHER}</option>
            </select>
          </div>

          <div className="animal-filter">
            <label htmlFor="size">PORTE</label>

            <select
              id="size"
              value={size}
              onChange={(event) =>
                handleSizeChange(event.target.value as AnimalSize | '')
              }
            >
              <option value="">Qualquer Porte</option>
              <option value="SMALL">{sizeLabels.SMALL}</option>
              <option value="MEDIUM">{sizeLabels.MEDIUM}</option>
              <option value="LARGE">{sizeLabels.LARGE}</option>
            </select>
          </div>

          <div className="animal-filter">
            <label htmlFor="sex">SEXO</label>

            <select
              id="sex"
              value={sex}
              onChange={(event) =>
                handleSexChange(event.target.value as AnimalSex | '')
              }
            >
              <option value="">Qualquer Sexo</option>
              <option value="MALE">{sexLabels.MALE}</option>
              <option value="FEMALE">{sexLabels.FEMALE}</option>
            </select>
          </div>

          <div className="animal-filter">
            <label htmlFor="age">IDADE</label>

            <select
              id="age"
              value={age}
              onChange={(event) =>
                handleAgeChange(event.target.value as AgeFilter)
              }
            >
              <option value="">Qualquer Idade</option>
              <option value="PUPPY">Filhote</option>
              <option value="YOUNG">Jovem</option>
              <option value="ADULT">Adulto</option>
              <option value="SENIOR">Idoso</option>
            </select>
          </div>

          <div className="animal-filter">
            <label htmlFor="state">ESTADO</label>

            <select
              id="state"
              value={state}
              onChange={(event) =>
                handleStateChange(event.target.value as BrazilianState | '')
              }
            >
              <option value="">Todos os estados</option>

              {states.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="animal-filter">
            <label htmlFor="city">CIDADE</label>

            <select
              id="city"
              value={city}
              disabled={!state || citiesLoading}
              onChange={(event) => handleCityChange(event.target.value)}
            >
              <option value="">
                {!state
                  ? 'Selecione o estado primeiro'
                  : citiesLoading
                    ? 'Carregando cidades...'
                    : 'Selecione a Cidade'}
              </option>

              {cities.map((cityName) => (
                <option key={cityName} value={cityName}>
                  {cityName}
                </option>
              ))}
            </select>
          </div>

          <button type="button" onClick={handleClearFilters}>
            Limpar filtros
          </button>
        </div>
      </div>

      <div className="animals-header">
        <h2>Animais disponíveis</h2>

        <p>
          Exibindo {data?.animals.total ?? 0} pets buscando um lar em sua região
        </p>
      </div>

      <div className="animals-grid">
        {loading && <p>Carregando animais...</p>}

        {error && <p>Não foi possível carregar os animais.</p>}

        {!loading &&
          !error &&
          animals.map((animal) => {
            const primaryImage =
              animal.images.find((image) => image.isPrimary) ??
              animal.images[0];

            return (
              <AnimalCard
                key={animal.id}
                name={animal.name}
                breed={animal.breed}
                age={formatAge(animal.ageInMonths)}
                city={animal.city}
                state={animal.state}
                species={speciesLabels[animal.species]}
                imageUrl={primaryImage ? `${API_URL}${primaryImage.url}` : ''}
              />
            );
          })}
      </div>

      <div className="animals-pagination">
        <div className="animals-pagination-pages">
          <button
            type="button"
            className="pagination-navigation"
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
          >
            <ChevronLeft />
          </button>

          {Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;

            return (
              <button
                key={page}
                type="button"
                className={page === currentPage ? 'active' : ''}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            );
          })}

          <button
            type="button"
            className="pagination-navigation"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => goToPage(currentPage + 1)}
          >
            <ChevronRight />
          </button>
        </div>

        <span>
          Exibindo{' '}
          {animals.length > 0
            ? `${(currentPage - 1) * PAGE_SIZE + 1}–${
                (currentPage - 1) * PAGE_SIZE + animals.length
              }`
            : '0'}{' '}
          de {data?.animals.total ?? 0} resultados
        </span>
      </div>
    </section>
  );
}

export default AnimalsSection;
