import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { ArrowLeft, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import './AnimalDetails.css';

import Footer from '../../components/layout/Footer/Footer';
import Header from '../../components/layout/Header/Header';
import { AnimalAbout } from '../../components/animalDetails/AnimalAbout/AnimalAbout';
import { AnimalCharacteristics } from '../../components/animalDetails/AnimalCharacteristics/AnimalCharacteristics';
import { AnimalGallery } from '../../components/animalDetails/AnimalGallery/AnimalGallery';
import { AnimalHealth } from '../../components/animalDetails/AnimalHealth/AnimalHealth';
import { AnimalSummary } from '../../components/animalDetails/AnimalSummary/AnimalSummary';
import { InterestCard } from '../../components/animalDetails/InterestCard/InterestCard';
import { RelatedAnimals } from '../../components/animalDetails/RelatedAnimals/RelatedAnimals';
import { formatAge } from '../../utils/animals';
import type {
  AnimalSex,
  AnimalSize,
  AnimalSpecies,
  AnimalStatus,
} from '../../utils/animals';

type AnimalImage = {
  id: string;
  url: string;
  isPrimary: boolean;
};

type AnimalDetail = {
  id: string;
  name: string;
  description: string;
  species: AnimalSpecies;
  breed: string;
  sex: AnimalSex;
  size: AnimalSize;
  state: string;
  city: string;
  ageInMonths: number;
  vaccinated: boolean;
  neutered: boolean;
  status: AnimalStatus;
  images: AnimalImage[];
};

type AnimalData = {
  animal: AnimalDetail;
};

type AnimalVariables = {
  id: string;
};

type RelatedAnimalsData = {
  animals: {
    items: {
      id: string;
      name: string;
      breed: string;
      species: AnimalSpecies;
      ageInMonths: number;
      city: string;
      state: string;
      status: AnimalStatus;
      images: AnimalImage[];
    }[];
  };
};

type RelatedAnimalsVariables = {
  filter: {
    page: number;
    limit: number;
  };
};

const RELATED_LIMIT = 5;

const ANIMAL: TypedDocumentNode<AnimalData, AnimalVariables> = gql`
  query Animal($id: String!) {
    animal(id: $id) {
      id
      name
      description
      species
      breed
      sex
      size
      state
      city
      ageInMonths
      vaccinated
      neutered
      status
      images {
        id
        url
        isPrimary
      }
    }
  }
`;

const RELATED_ANIMALS: TypedDocumentNode<
  RelatedAnimalsData,
  RelatedAnimalsVariables
> = gql`
  query RelatedAnimals($filter: AnimalsFilterInputDTO) {
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
    }
  }
`;

const API_URL = import.meta.env.VITE_API_URL.replace('/graphql', '');

function AnimalDetails() {
  const { id } = useParams();

  const [shared, setShared] = useState(false);

  const { data, loading, error } = useQuery(ANIMAL, {
    variables: { id: id ?? '' },
    skip: !id,
  });

  const { data: relatedData } = useQuery(RELATED_ANIMALS, {
    variables: {
      filter: { page: 1, limit: RELATED_LIMIT },
    },
  });

  useEffect(() => {
    if (!shared) {
      return;
    }

    const timeout = setTimeout(() => setShared(false), 2000);

    return () => clearTimeout(timeout);
  }, [shared]);

  const animal = data?.animal;

  const images = (animal?.images ?? []).map((image) => ({
    id: image.id,
    url: `${API_URL}${image.url}`,
  }));

  const relatedAnimals = (relatedData?.animals.items ?? [])
    .filter((item) => item.id !== id)
    .slice(0, 4);

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      await navigator.share({ title: animal?.name, url }).catch(() => {});

      return;
    }

    await navigator.clipboard?.writeText(url);

    setShared(true);
  }

  if (loading) {
    return (
      <>
        <Header />

        <main className="animal-details-status">
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

        <main className="animal-details-status">
          <p>Não foi possível carregar este animal.</p>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="animal-details">
        <div className="animal-details-toolbar">
          <Link className="animal-details-back" to="/#animals">
            <ArrowLeft />
            Voltar para busca
          </Link>

          <button
            type="button"
            className="animal-details-share"
            onClick={handleShare}
          >
            <Share2 />
            {shared ? 'Link copiado' : 'Compartilhar'}
          </button>
        </div>

        <div className="animal-details-main">
          <AnimalGallery images={images} alt={animal.name} />

          <div className="animal-details-info">
            <AnimalSummary
              name={animal.name}
              city={animal.city}
              state={animal.state}
              status={animal.status}
            />

            <AnimalCharacteristics
              species={animal.species}
              breed={animal.breed}
              sex={animal.sex}
              age={formatAge(animal.ageInMonths)}
              size={animal.size}
            />

            <AnimalHealth
              vaccinated={animal.vaccinated}
              neutered={animal.neutered}
            />

            <AnimalAbout description={animal.description} />

            <InterestCard animalId={animal.id} name={animal.name} />
          </div>
        </div>

        {relatedAnimals.length > 0 && (
          <RelatedAnimals animals={relatedAnimals} />
        )}
      </main>

      <Footer />
    </>
  );
}

export default AnimalDetails;
