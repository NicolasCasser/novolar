import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Ban, CheckCircle, ClipboardList, Clock } from 'lucide-react';
import { useMemo, useState } from 'react';

import './RequestList.css';

import { AdminLayout } from '../../components/dashboard/AdminLayout/AdminLayout';
import { RequestsFilters } from '../../components/requestList/RequestsFilters/RequestsFilters';
import type { RequestFilters } from '../../components/requestList/RequestsFilters/RequestsFilters';
import { SummaryCards } from '../../components/ui/SummaryCards/SummaryCards';
import type { SummaryCard } from '../../components/ui/SummaryCards/SummaryCards';
import { RequestsTable } from '../../components/requestList/RequestsTable/RequestsTable';
import type { RequestListItem } from '../../components/requestList/RequestsTable/RequestsTable';
import type { AdoptionRequestStatus } from '../../utils/adoptionRequests';
import type { BrazilianState } from '../../utils/locations';

type RequestsData = {
  adoptionRequests: {
    items: {
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
    }[];
    total: number;
    page: number;
    totalPages: number;
  };
};

type RequestsVariables = {
  filter: {
    page: number;
    limit: number;
    search?: string;
    status?: AdoptionRequestStatus;
    animalId?: string;
    state?: BrazilianState;
    city?: string;
    orderBy?: 'CREATED_AT_DESC';
  };
};

type CountData = {
  adoptionRequests: {
    total: number;
  };
};

type CountVariables = {
  filter: {
    page: number;
    limit: number;
    status: AdoptionRequestStatus;
  };
};

type AnimalOptionsData = {
  animals: {
    items: {
      id: string;
      name: string;
    }[];
  };
};

type CitiesData = {
  cities: string[];
};

type CitiesVariables = {
  state: BrazilianState;
};

const REQUESTS: TypedDocumentNode<RequestsData, RequestsVariables> = gql`
  query RequestList($filter: AdoptionRequestsFilterInputDTO) {
    adoptionRequests(filter: $filter) {
      items {
        id
        status
        createdAt
        applicantName
        city
        state
        animal {
          id
          name
        }
      }
      total
      page
      totalPages
    }
  }
`;

const STATUS_COUNT: TypedDocumentNode<CountData, CountVariables> = gql`
  query RequestListCount($filter: AdoptionRequestsFilterInputDTO) {
    adoptionRequests(filter: $filter) {
      total
    }
  }
`;

const ANIMAL_OPTIONS: TypedDocumentNode<
  AnimalOptionsData,
  Record<string, never>
> = gql`
  query RequestListAnimals {
    animals(filter: { page: 1, limit: 50 }) {
      items {
        id
        name
      }
    }
  }
`;

const CITIES: TypedDocumentNode<CitiesData, CitiesVariables> = gql`
  query RequestListCities($state: BrazilianState!) {
    cities(state: $state)
  }
`;

const PAGE_SIZE = 5;

const initialFilters: RequestFilters = {
  search: '',
  status: '',
  animalId: '',
  state: '',
  city: '',
};

function RequestList() {
  const [filters, setFilters] = useState(initialFilters);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, loading, error } = useQuery(REQUESTS, {
    variables: {
      filter: {
        page,
        limit: PAGE_SIZE,
        search: search || undefined,
        status: filters.status || undefined,
        animalId: filters.animalId || undefined,
        state: filters.state || undefined,
        city: filters.city || undefined,
        orderBy: 'CREATED_AT_DESC',
      },
    },
  });

  const { data: approvedData } = useQuery(STATUS_COUNT, {
    variables: {
      filter: { page: 1, limit: 1, status: 'APPROVED' },
    },
  });

  const { data: pendingData } = useQuery(STATUS_COUNT, {
    variables: {
      filter: { page: 1, limit: 1, status: 'PENDING' },
    },
  });

  const { data: rejectedData } = useQuery(STATUS_COUNT, {
    variables: {
      filter: { page: 1, limit: 1, status: 'REJECTED' },
    },
  });

  const { data: animalsData } = useQuery(ANIMAL_OPTIONS);

  const { data: citiesData, loading: citiesLoading } = useQuery(CITIES, {
    variables: { state: filters.state as BrazilianState },
    skip: !filters.state,
  });

  const items = useMemo(
    () => data?.adoptionRequests.items ?? [],
    [data?.adoptionRequests.items],
  );

  const total = data?.adoptionRequests.total ?? 0;
  const totalPages = data?.adoptionRequests.totalPages ?? 0;

  // Une os animais da query publica com os que aparecem na lista, para que
  // animais ja adotados tambem possam ser usados no filtro.

  const animalOptions = useMemo(() => {
    const options = new Map<string, string>();

    for (const animal of animalsData?.animals.items ?? []) {
      options.set(animal.id, animal.name);
    }

    for (const item of items) {
      options.set(item.animal.id, item.animal.name);
    }

    return Array.from(options, ([id, name]) => ({ id, name })).sort((a, b) =>
      a.name.localeCompare(b.name, 'pt-BR'),
    );
  }, [animalsData, items]);

  function handleChange(field: keyof RequestFilters, value: string) {
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

  const listItems: RequestListItem[] = items.map((item) => ({
    id: item.id,
    status: item.status,
    createdAt: item.createdAt,
    applicantName: item.applicantName,
    city: item.city,
    state: item.state,
    animal: { id: item.animal.id, name: item.animal.name },
  }));

  const summaryCards: SummaryCard[] = [
    {
      label: 'TOTAL DE SOLICITAÇÕES',
      value: total,
      icon: ClipboardList,
    },
    {
      label: 'APROVADAS',
      value: approvedData?.adoptionRequests.total ?? 0,
      icon: CheckCircle,
    },
    {
      label: 'PENDENTES',
      value: pendingData?.adoptionRequests.total ?? 0,
      icon: Clock,
    },
    {
      label: 'RECUSADAS',
      value: rejectedData?.adoptionRequests.total ?? 0,
      icon: Ban,
    },
  ];

  return (
    <AdminLayout title="Solicitações de adoção">
      <div className="request-list">
        <h1>Gerenciamento</h1>

        <p className="request-list-description">
          Gerencie os pedidos de interesse em adoção e acompanhe o status de
          cada processo.
        </p>

        <RequestsFilters
          filters={filters}
          animals={animalOptions}
          cities={citiesData?.cities ?? []}
          citiesLoading={citiesLoading}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onClear={handleClear}
        />

        <RequestsTable
          items={listItems}
          total={total}
          page={page}
          totalPages={totalPages}
          pageSize={PAGE_SIZE}
          loading={loading}
          error={error ? 'Não foi possível carregar as solicitações.' : ''}
          onPageChange={handlePageChange}
        />

        <SummaryCards items={summaryCards} />
      </div>
    </AdminLayout>
  );
}

export default RequestList;
