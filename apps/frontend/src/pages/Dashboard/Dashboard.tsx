import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

import './Dashboard.css';

import { AdminLayout } from '../../components/dashboard/AdminLayout/AdminLayout';
import { RecentAnimals } from '../../components/dashboard/RecentAnimals/RecentAnimals';
import type { RecentAnimal } from '../../components/dashboard/RecentAnimals/RecentAnimals';
import { RecentRequests } from '../../components/dashboard/RecentRequests/RecentRequests';
import type { RecentRequest } from '../../components/dashboard/RecentRequests/RecentRequests';
import { StatCards } from '../../components/dashboard/StatCards/StatCards';
import type { AnimalSpecies } from '../../utils/animals';
import type { AdoptionRequestStatus } from '../../utils/adoptionRequests';
import { resolveImageUrl } from '../../utils/images';

type AnimalListData = {
  animals: {
    items: {
      id: string;
      name: string;
      species: AnimalSpecies;
      city: string;
      state: string;
      createdAt: string;
      images: {
        id: string;
        url: string;
        isPrimary: boolean;
      }[];
    }[];
    total: number;
  };
};

type AnimalListVariables = {
  filter: {
    page: number;
    limit: number;
    status?: 'AVAILABLE' | 'ADOPTED';
    orderBy?: 'CREATED_AT_DESC';
  };
};

type AdoptionRequestsData = {
  adoptionRequests: {
    items: {
      id: string;
      applicantName: string;
      city: string;
      state: string;
      createdAt: string;
      status: AdoptionRequestStatus;
      animal: {
        name: string;
      };
    }[];
    total: number;
  };
};

type AdoptionRequestsVariables = {
  filter: {
    page: number;
    limit: number;
    status?: AdoptionRequestStatus;
    orderBy?: 'CREATED_AT_DESC';
  };
};

const AVAILABLE_ANIMALS: TypedDocumentNode<
  AnimalListData,
  AnimalListVariables
> = gql`
  query DashboardAvailableAnimals($filter: AnimalsFilterInputDTO) {
    animals(filter: $filter) {
      items {
        id
        name
        species
        city
        state
        createdAt
        images {
          id
          url
          isPrimary
        }
      }
      total
    }
  }
`;

const ADOPTED_ANIMALS: TypedDocumentNode<AnimalListData, AnimalListVariables> =
  gql`
    query DashboardAdoptedAnimals($filter: AnimalsFilterInputDTO) {
      animals(filter: $filter) {
        items {
          id
        }
        total
      }
    }
  `;

const RECENT_REQUESTS: TypedDocumentNode<
  AdoptionRequestsData,
  AdoptionRequestsVariables
> = gql`
  query DashboardRecentRequests($filter: AdoptionRequestsFilterInputDTO) {
    adoptionRequests(filter: $filter) {
      items {
        id
        applicantName
        city
        state
        createdAt
        status
        animal {
          name
        }
      }
      total
    }
  }
`;

const PENDING_REQUESTS: TypedDocumentNode<
  AdoptionRequestsData,
  AdoptionRequestsVariables
> = gql`
  query DashboardPendingRequests($filter: AdoptionRequestsFilterInputDTO) {
    adoptionRequests(filter: $filter) {
      items {
        id
      }
      total
    }
  }
`;

const RECENT_ANIMALS_LIMIT = 3;
const RECENT_REQUESTS_LIMIT = 5;
const COUNT_LIMIT = 1;

function Dashboard() {
  const { data: availableData, error: availableQueryError } = useQuery(
    AVAILABLE_ANIMALS,
    {
      variables: {
        filter: {
          page: 1,
          limit: RECENT_ANIMALS_LIMIT,
          status: 'AVAILABLE',
          orderBy: 'CREATED_AT_DESC',
        },
      },
    },
  );

  const { data: adoptedData, error: adoptedQueryError } = useQuery(
    ADOPTED_ANIMALS,
    {
      variables: {
        filter: { page: 1, limit: COUNT_LIMIT, status: 'ADOPTED' },
      },
    },
  );

  const { data: requestsData, error: requestsQueryError } = useQuery(
    RECENT_REQUESTS,
    {
      variables: {
        filter: {
          page: 1,
          limit: RECENT_REQUESTS_LIMIT,
          orderBy: 'CREATED_AT_DESC',
        },
      },
    },
  );

  const { data: pendingData, error: pendingQueryError } = useQuery(
    PENDING_REQUESTS,
    {
      variables: {
        filter: { page: 1, limit: COUNT_LIMIT, status: 'PENDING' },
      },
    },
  );

  const availableAnimals = availableData?.animals.items ?? [];
  const availableTotal = availableData?.animals.total ?? 0;
  const adoptedTotal = adoptedData?.animals.total ?? 0;

  const requests = requestsData?.adoptionRequests.items ?? [];
  const pendingTotal = pendingData?.adoptionRequests.total ?? 0;

  const animalsError = availableQueryError
    ? 'Não foi possível carregar os animais.'
    : '';
  const requestsError = requestsQueryError
    ? 'Não foi possível carregar as solicitações.'
    : '';
  const statsError =
    availableQueryError || adoptedQueryError || pendingQueryError
      ? 'Não foi possível carregar os indicadores.'
      : '';

  const recentAnimals: RecentAnimal[] = availableAnimals.map((animal) => {
    const primaryImage =
      animal.images.find((image) => image.isPrimary) ?? animal.images[0];

    return {
      id: animal.id,
      name: animal.name,
      species: animal.species,
      city: animal.city,
      state: animal.state,
      createdAt: animal.createdAt,
      imageUrl: primaryImage ? resolveImageUrl(primaryImage.url) : '',
    };
  });

  const recentRequests: RecentRequest[] = requests.map((request) => ({
    id: request.id,
    applicantName: request.applicantName,
    city: request.city,
    state: request.state,
    createdAt: request.createdAt,
    status: request.status,
    animal: { name: request.animal?.name ?? '-' },
  }));

  return (
    <AdminLayout title="Dashboard">
      <div className="dashboard-content">
        <div className="dashboard-intro">
          <h2>Visão geral</h2>

          <p>Resumo da plataforma.</p>
        </div>

        <StatCards
          registeredAnimals={availableTotal + adoptedTotal}
          availableAnimals={availableTotal}
          pendingRequests={pendingTotal}
          error={statsError}
        />

        <div className="dashboard-panels">
          <RecentRequests requests={recentRequests} error={requestsError} />

          <RecentAnimals animals={recentAnimals} error={animalsError} />
        </div>
      </div>
    </AdminLayout>
  );
}

export default Dashboard;
