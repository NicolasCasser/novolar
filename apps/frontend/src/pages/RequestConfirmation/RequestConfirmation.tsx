import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Grid3x3 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import './RequestConfirmation.css';

import Footer from '../../components/layout/Footer/Footer';
import Header from '../../components/layout/Header/Header';
import { ConfirmedAnimalCard } from '../../components/requestConfirmation/ConfirmedAnimalCard/ConfirmedAnimalCard';
import { NextStepsCards } from '../../components/requestConfirmation/NextStepsCards/NextStepsCards';
import { SuccessMessage } from '../../components/requestConfirmation/SuccessMessage/SuccessMessage';

type AnimalData = {
  animal: {
    id: string;
    name: string;
    breed: string;
    city: string;
    state: string;
    images: {
      id: string;
      url: string;
      isPrimary: boolean;
    }[];
  };
};

type AnimalVariables = {
  id: string;
};

const ANIMAL: TypedDocumentNode<AnimalData, AnimalVariables> = gql`
  query ConfirmedAnimal($id: String!) {
    animal(id: $id) {
      id
      name
      breed
      city
      state
      images {
        id
        url
        isPrimary
      }
    }
  }
`;

const API_URL = import.meta.env.VITE_API_URL.replace('/graphql', '');

function RequestConfirmation() {
  const { id } = useParams();

  const { data, loading, error } = useQuery(ANIMAL, {
    variables: { id: id ?? '' },
    skip: !id,
  });

  const animal = data?.animal;

  if (loading) {
    return (
      <>
        <Header />

        <main className="request-confirmation-status">
          <p>Carregando animal...</p>
        </main>

        <Footer />
      </>
    );
  }

  if (error || !animal) {
    return (
      <>
        <Header />

        <main className="request-confirmation-status">
          <p>Não foi possível carregar este animal.</p>
        </main>

        <Footer />
      </>
    );
  }

  const primaryImage =
    animal.images.find((image) => image.isPrimary) ?? animal.images[0];

  return (
    <>
      <Header />

      <main className="request-confirmation">
        <div className="request-confirmation-content">
          <SuccessMessage
            title="Solicitação enviada com sucesso!"
            description="Recebemos seu interesse em adoção. A equipe responsável analisará sua solicitação e entrará em contato caso seja necessário dar continuidade ao processo."
          />

          <ConfirmedAnimalCard
            name={animal.name}
            breed={animal.breed}
            city={animal.city}
            state={animal.state}
            imageUrl={primaryImage ? `${API_URL}${primaryImage.url}` : ''}
          />

          <div className="request-confirmation-action">
            <Link className="request-confirmation-button" to="/#animals">
              <Grid3x3 />
              Voltar para animais
            </Link>
          </div>

          <NextStepsCards />
        </div>
      </main>

      <Footer />
    </>
  );
}

export default RequestConfirmation;
