import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { ClipboardList, PawPrint, Plus, TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './AnimalsList.css';

import { AdminLayout } from '../../components/dashboard/AdminLayout/AdminLayout';
import { AnimalsFilters } from '../../components/animalsList/AnimalsFilters/AnimalsFilters';
import type { AnimalFilters } from '../../components/animalsList/AnimalsFilters/AnimalsFilters';
import { AnimalsTable } from '../../components/animalsList/AnimalsTable/AnimalsTable';
import type { AnimalListItem } from '../../components/animalsList/AnimalsTable/AnimalsTable';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog/ConfirmDialog';
import { SummaryCards } from '../../components/ui/SummaryCards/SummaryCards';
import type { SummaryCard } from '../../components/ui/SummaryCards/SummaryCards';
import { formatAge } from '../../utils/animals';
import type {
  AnimalSex,
  AnimalSize,
  AnimalSpecies,
  AnimalStatus,
} from '../../utils/animals';
import type { BrazilianState } from '../../utils/locations';

type AnimalItem = {
  id: string;
  name: string;
  species: AnimalSpecies;
  ageInMonths: number;
  city: string;
  state: string;
  createdAt: string;
  status: AnimalStatus;
  images: {
    id: string;
    url: string;
    isPrimary: boolean;
  }[];
};

type AnimalsData = {
  animals: {
    items: AnimalItem[];
    total: number;
    totalPages: number;
  };
};

type AnimalsVariables = {
  filter: {
    page: number;
    limit: number;
    search?: string;
    species?: AnimalSpecies;
    size?: AnimalSize;
    sex?: AnimalSex;
    status?: AnimalStatus;
    state?: BrazilianState;
    city?: string;
    orderBy?: 'CREATED_AT_DESC';
    createdFrom?: string;
  };
};

type CitiesData = {
  cities: string[];
};

type CitiesVariables = {
  state: BrazilianState;
};

type DeleteAnimalData = {
  deleteAnimal: string;
};

const ANIMALS: TypedDocumentNode<AnimalsData, AnimalsVariables> = gql`
  query AnimalsList($filter: AnimalsFilterInputDTO) {
    animals(filter: $filter) {
      items {
        id
        name
        species
        ageInMonths
        city
        state
        createdAt
        status
        images {
          id
          url
          isPrimary
        }
      }
      total
      totalPages
    }
  }
`;

const CITIES: TypedDocumentNode<CitiesData, CitiesVariables> = gql`
  query AnimalsListCities($state: BrazilianState!) {
    cities(state: $state)
  }
`;

const DELETE_ANIMAL: TypedDocumentNode<DeleteAnimalData, { id: string }> = gql`
  mutation AnimalsListDeleteAnimal($id: String!) {
    deleteAnimal(id: $id)
  }
`;

const API_URL = import.meta.env.VITE_API_URL.replace('/graphql', '');

const PAGE_SIZE = 5;

const initialFilters: AnimalFilters = {
  search: '',
  species: '',
  size: '',
  sex: '',
  status: '',
  state: '',
  city: '',
};

// Primeiro dia do mes corrente, usado no cartao "Novos este mes".

function startOfCurrentMonth(): string {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

function AnimalsList() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState(initialFilters);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [animalToRemove, setAnimalToRemove] = useState<AnimalListItem | null>(
    null,
  );
  const [removeError, setRemoveError] = useState('');

  const [deleteAnimal, { loading: removing }] = useMutation(DELETE_ANIMAL);

  const { data, loading, error } = useQuery(ANIMALS, {
    variables: {
      filter: {
        page,
        limit: PAGE_SIZE,
        search: search || undefined,
        species: filters.species || undefined,
        size: filters.size || undefined,
        sex: filters.sex || undefined,
        status: filters.status || undefined,
        state: filters.state || undefined,
        city: filters.city || undefined,
        orderBy: 'CREATED_AT_DESC',
      },
    },
  });

  const { data: totalData } = useQuery(ANIMALS, {
    variables: {
      filter: { page: 1, limit: 1, status: 'AVAILABLE' },
    },
  });

  const { data: adoptedData } = useQuery(ANIMALS, {
    variables: {
      filter: { page: 1, limit: 1, status: 'ADOPTED' },
    },
  });

  const { data: newThisMonthData } = useQuery(ANIMALS, {
    variables: {
      filter: {
        page: 1,
        limit: 1,
        createdFrom: startOfCurrentMonth(),
      },
    },
  });

  const { data: citiesData, loading: citiesLoading } = useQuery(CITIES, {
    variables: { state: filters.state as BrazilianState },
    skip: !filters.state,
  });

  const items = useMemo(() => data?.animals.items ?? [], [data?.animals.items]);

  const total = data?.animals.total ?? 0;
  const totalPages = data?.animals.totalPages ?? 0;

  const availableTotal = totalData?.animals.total ?? 0;
  const adoptedTotal = adoptedData?.animals.total ?? 0;
  const newThisMonthTotal = newThisMonthData?.animals.total ?? 0;

  const listItems: AnimalListItem[] = items.map((item) => {
    const primaryImage =
      item.images.find((image) => image.isPrimary) ?? item.images[0];

    return {
      id: item.id,
      name: item.name,
      species: item.species,
      age: formatAge(item.ageInMonths),
      city: item.city,
      state: item.state,
      createdAt: item.createdAt,
      status: item.status,
      imageUrl: primaryImage ? `${API_URL}${primaryImage.url}` : '',
    };
  });

  const summaryCards: SummaryCard[] = [
    {
      label: 'TOTAL ANIMAIS',
      value: availableTotal + adoptedTotal,
      icon: PawPrint,
    },
    {
      label: 'NOVOS ESTE MÊS',
      value: newThisMonthTotal,
      icon: Plus,
    },
    {
      label: 'ADOTADOS',
      value: adoptedTotal,
      icon: ClipboardList,
    },
    {
      label: 'DISPONÍVEIS',
      value: availableTotal,
      icon: TrendingUp,
    },
  ];

  function handleChange(field: keyof AnimalFilters, value: string) {
    setFilters((current) => {
      const next = { ...current, [field]: value };

      if (field === 'state') {
        next.city = '';
      }

      return next;
    });

    setPage(1);
  }

  function handleSubmit() {
    setSearch(filters.search.trim());
    setPage(1);
  }

  function handleClear() {
    setFilters(initialFilters);
    setSearch('');
    setPage(1);
  }

  function handlePageChange(nextPage: number) {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) {
      return;
    }

    setPage(nextPage);
  }

  function handleView(animal: AnimalListItem) {
    navigate(`/animals/${animal.id}`);
  }

  function handleEdit(animal: AnimalListItem) {
    navigate(`/dashboard/animais/${animal.id}/editar`);
  }

  function handleAskRemove(animal: AnimalListItem) {
    setRemoveError('');

    setAnimalToRemove(animal);
  }

  function handleCancelRemove() {
    setAnimalToRemove(null);
  }

  async function handleConfirmRemove() {
    if (!animalToRemove) {
      return;
    }

    setRemoveError('');

    try {
      await deleteAnimal({ variables: { id: animalToRemove.id } });

      setAnimalToRemove(null);
    } catch {
      setRemoveError('Não foi possível remover o animal. Tente novamente.');
    }
  }

  return (
    <AdminLayout title="Gerenciamento">
      <div className="animals-list">
        <div className="animals-list-header">
          <div>
            <h1>Animais</h1>

            <p className="animals-list-description">
              Gerencie o catálogo de animais disponíveis para adoção.
            </p>
          </div>

          <button
            type="button"
            className="animals-list-create"
            onClick={() => navigate('/dashboard/animais/novo')}
          >
            <Plus />
            Novo animal
          </button>
        </div>

        <AnimalsFilters
          filters={filters}
          cities={citiesData?.cities ?? []}
          citiesLoading={citiesLoading}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onClear={handleClear}
        />

        <AnimalsTable
          items={listItems}
          total={total}
          page={page}
          totalPages={totalPages}
          pageSize={PAGE_SIZE}
          loading={loading}
          error={error ? 'Não foi possível carregar os animais.' : ''}
          onPageChange={handlePageChange}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleAskRemove}
        />

        <SummaryCards items={summaryCards} />
      </div>

      <ConfirmDialog
        open={Boolean(animalToRemove)}
        title="Remover animal"
        description={
          animalToRemove
            ? `${animalToRemove.name} será removido permanentemente do catálogo. Esta ação não pode ser desfeita.${removeError ? ` ${removeError}` : ''}`
            : ''
        }
        confirmLabel="Remover"
        loading={removing}
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemove}
      />
    </AdminLayout>
  );
}

export default AnimalsList;
