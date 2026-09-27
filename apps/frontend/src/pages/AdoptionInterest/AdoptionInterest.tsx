import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import './AdoptionInterest.css';

import Footer from '../../components/layout/Footer/Footer';
import Header from '../../components/layout/Header/Header';
import { ContactForm } from '../../components/adoptionInterest/ContactForm/ContactForm';
import { InterestAnimalCard } from '../../components/adoptionInterest/InterestAnimalCard/InterestAnimalCard';
import { InterestSteps } from '../../components/adoptionInterest/InterestSteps/InterestSteps';
import type { AnimalSpecies } from '../../utils/animals';
import type { BrazilianState } from '../../utils/locations';
import { resolveImageUrl } from '../../utils/images';

type AnimalData = {
  animal: {
    id: string;
    name: string;
    breed: string;
    species: AnimalSpecies;
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

type CreateAdoptionRequestData = {
  createAdoptionRequest: {
    id: string;
    status: string;
  };
};

type CreateAdoptionRequestInput = {
  animalId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  state: BrazilianState;
  city: string;
  message: string;
};

const ANIMAL: TypedDocumentNode<AnimalData, AnimalVariables> = gql`
  query InterestAnimal($id: String!) {
    animal(id: $id) {
      id
      name
      breed
      species
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

const CREATE_ADOPTION_REQUEST: TypedDocumentNode<
  CreateAdoptionRequestData,
  { input: CreateAdoptionRequestInput }
> = gql`
  mutation CreateAdoptionRequest($input: CreateAdoptionRequestInputDTO!) {
    createAdoptionRequest(input: $input) {
      id
      status
    }
  }
`;

const initialValues = {
  applicantName: '',
  applicantEmail: '',
  applicantPhone: '',
  city: '',
  state: '' as BrazilianState | '',
  message: '',
};

function AdoptionInterest() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState('');

  const {
    data,
    loading: loadingAnimal,
    error: animalError,
  } = useQuery(ANIMAL, { variables: { id: id ?? '' }, skip: !id });

  const [createAdoptionRequest, { loading: submitting }] = useMutation(
    CREATE_ADOPTION_REQUEST,
  );

  const animal = data?.animal;

  function handleChange(field: keyof typeof initialValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!animal) {
      return;
    }

    setError('');

    try {
      await createAdoptionRequest({
        variables: {
          input: {
            animalId: animal.id,
            applicantName: values.applicantName.trim(),
            applicantEmail: values.applicantEmail.trim(),
            applicantPhone: values.applicantPhone.trim(),
            state: values.state as BrazilianState,
            city: values.city.trim(),
            message: values.message.trim(),
          },
        },
      });

      setValues(initialValues);

      navigate(`/animals/${animal.id}/interesse/enviada`);
    } catch {
      setError('Não foi possível enviar sua solicitação. Tente novamente.');
    }
  }

  if (loadingAnimal) {
    return (
      <>
        <Header />

        <main className="adoption-interest-status">
          <p>Carregando animal...</p>
        </main>

        <Footer />
      </>
    );
  }

  if (animalError || !animal) {
    return (
      <>
        <Header />

        <main className="adoption-interest-status">
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

      <main className="adoption-interest">
        <div className="adoption-interest-header">
          <Link className="adoption-interest-back" to={`/animals/${animal.id}`}>
            <ArrowLeft />
            Voltar para o perfil do {animal.name}
          </Link>

          <h1>Formulário de Interesse</h1>

          <p>Preencha os campos abaixo para iniciar seu processo de adoção.</p>
        </div>

        <div className="adoption-interest-layout">
          <aside className="adoption-interest-sidebar">
            <InterestAnimalCard
              name={animal.name}
              breed={animal.breed}
              species={animal.species}
              city={animal.city}
              state={animal.state}
              imageUrl={primaryImage ? resolveImageUrl(primaryImage.url) : ''}
            />

            <InterestSteps />
          </aside>

          <ContactForm
            loading={submitting}
            error={error}
            values={values}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </div>
      </main>

      <Footer />
    </>
  );
}

export default AdoptionInterest;
