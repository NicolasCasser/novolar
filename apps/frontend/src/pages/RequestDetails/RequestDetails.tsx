import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import './RequestDetails.css';

import { AdminLayout } from '../../components/dashboard/AdminLayout/AdminLayout';
import { RequestStatusBadge } from '../../components/ui/RequestStatusBadge/RequestStatusBadge';
import { ApplicantCard } from '../../components/requestDetails/ApplicantCard/ApplicantCard';
import { RequestAnimalCard } from '../../components/requestDetails/RequestAnimalCard/RequestAnimalCard';
import { StatusManager } from '../../components/requestDetails/StatusManager/StatusManager';
import { formatAge } from '../../utils/animals';
import type { AnimalSex, AnimalSize, AnimalSpecies } from '../../utils/animals';
import type { AdoptionRequestStatus } from '../../utils/adoptionRequests';
import type { BrazilianState } from '../../utils/locations';
import { formatDate, formatTime } from '../../utils/date';

type RequestData = {
  adoptionRequest: {
    id: string;
    status: AdoptionRequestStatus;
    createdAt: string;
    applicantName: string;
    applicantEmail: string;
    applicantPhone: string;
    city: string;
    state: BrazilianState;
    message: string;
    animal: {
      id: string;
      name: string;
      breed: string;
      species: AnimalSpecies;
      sex: AnimalSex;
      size: AnimalSize;
      city: string;
      state: string;
      ageInMonths: number;
      images: {
        id: string;
        url: string;
        isPrimary: boolean;
      }[];
    };
  };
};

type RequestVariables = {
  id: string;
};

type StatusPayload = {
  id: string;
  status: AdoptionRequestStatus;
};

const REQUEST: TypedDocumentNode<RequestData, RequestVariables> = gql`
  query RequestDetails($id: ID!) {
    adoptionRequest(id: $id) {
      id
      status
      createdAt
      applicantName
      applicantEmail
      applicantPhone
      city
      state
      message
      animal {
        id
        name
        breed
        species
        sex
        size
        city
        state
        ageInMonths
        images {
          id
          url
          isPrimary
        }
      }
    }
  }
`;

const START_ANALYSIS: TypedDocumentNode<
  { startAdoptionRequestAnalysis: StatusPayload },
  RequestVariables
> = gql`
  mutation RequestDetailsStartAnalysis($id: ID!) {
    startAdoptionRequestAnalysis(id: $id) {
      id
      status
    }
  }
`;

const APPROVE: TypedDocumentNode<
  { approveAdoptionRequest: StatusPayload },
  RequestVariables
> = gql`
  mutation RequestDetailsApprove($id: ID!) {
    approveAdoptionRequest(id: $id) {
      id
      status
    }
  }
`;

const REJECT: TypedDocumentNode<
  { rejectAdoptionRequest: StatusPayload },
  RequestVariables
> = gql`
  mutation RequestDetailsReject($id: ID!) {
    rejectAdoptionRequest(id: $id) {
      id
      status
    }
  }
`;

const API_URL = import.meta.env.VITE_API_URL.replace('/graphql', '');

// O backend nao expoe um numero de protocolo, entao derivamos uma
// referencia curta e estavel a partir do id apenas para exibicao.

function buildReference(id: string): string {
  return `SOL-${id.slice(0, 4).toUpperCase()}-${id.slice(4, 8).toUpperCase()}`;
}

function RequestDetails() {
  const { id } = useParams();

  const [statusError, setStatusError] = useState('');

  const { data, loading, error } = useQuery(REQUEST, {
    variables: { id: id ?? '' },
    skip: !id,
  });

  const [startAnalysis, { loading: startingAnalysis }] =
    useMutation(START_ANALYSIS);
  const [approve, { loading: approving }] = useMutation(APPROVE);
  const [reject, { loading: rejecting }] = useMutation(REJECT);

  const request = data?.adoptionRequest;

  const changingStatus = startingAnalysis || approving || rejecting;

  // Cada transicao de status corresponde a uma mutation especifica do backend.

  const statusActions: Partial<
    Record<AdoptionRequestStatus, () => Promise<unknown>>
  > = {
    IN_ANALYSIS: () => startAnalysis({ variables: { id: id ?? '' } }),
    APPROVED: () => approve({ variables: { id: id ?? '' } }),
    REJECTED: () => reject({ variables: { id: id ?? '' } }),
  };

  async function handleStatusChange(next: AdoptionRequestStatus) {
    const action = statusActions[next];

    if (!action) {
      return;
    }

    setStatusError('');

    try {
      await action();
    } catch {
      setStatusError('Não foi possível alterar o status. Tente novamente.');
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Solicitação">
        <p className="request-details-status">Carregando solicitação...</p>
      </AdminLayout>
    );
  }

  if (error || !request) {
    return (
      <AdminLayout title="Solicitação">
        <p className="request-details-status">
          Não foi possível carregar esta solicitação.
        </p>
      </AdminLayout>
    );
  }

  const primaryImage =
    request.animal.images.find((image) => image.isPrimary) ??
    request.animal.images[0];

  return (
    <AdminLayout title={`Solicitação ${buildReference(request.id)}`}>
      <div className="request-details">
        <Link className="request-details-back" to="/dashboard/solicitacoes">
          <ArrowLeft />
          Voltar para solicitações
        </Link>

        <div className="request-details-header">
          <div>
            <h1>Detalhes da solicitação</h1>

            <p className="request-details-meta">
              <span>
                <Calendar />
                {formatDate(request.createdAt)}
              </span>

              <span className="request-details-meta-divider" />

              <span>
                <Clock />
                Recebida às {formatTime(request.createdAt)}
              </span>
            </p>
          </div>

          <RequestStatusBadge status={request.status} />
        </div>

        <div className="request-details-grid">
          <RequestAnimalCard
            animalId={request.animal.id}
            name={request.animal.name}
            breed={request.animal.breed}
            species={request.animal.species}
            sex={request.animal.sex}
            size={request.animal.size}
            age={formatAge(request.animal.ageInMonths)}
            city={request.animal.city}
            state={request.animal.state}
            imageUrl={primaryImage ? `${API_URL}${primaryImage.url}` : ''}
          />

          <div className="request-details-side">
            <ApplicantCard
              name={request.applicantName}
              email={request.applicantEmail}
              phone={request.applicantPhone}
              city={request.city}
              state={request.state}
              message={request.message}
            />

            <StatusManager
              status={request.status}
              loading={changingStatus}
              error={statusError}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default RequestDetails;
