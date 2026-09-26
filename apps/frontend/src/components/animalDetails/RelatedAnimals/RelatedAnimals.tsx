import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

import { AnimalCard } from '../../home/AnimalsSection/AnimalCard/AnimalCard';
import { formatAge } from '../../../utils/animals';
import type { AnimalSpecies } from '../../../utils/animals';

import './RelatedAnimals.css';

const API_URL = import.meta.env.VITE_API_URL.replace('/graphql', '');

interface RelatedAnimal {
  id: string;
  name: string;
  breed: string;
  species: AnimalSpecies;
  ageInMonths: number;
  city: string;
  state: string;
  images: {
    id: string;
    url: string;
    isPrimary: boolean;
  }[];
}
interface RelatedAnimalsProps {
  animals: RelatedAnimal[];
}

export function RelatedAnimals({ animals }: RelatedAnimalsProps) {
  return (
    <section className="related-animals">
      <div className="related-animals-header">
        <div className="related-animals-heading">
          <h2>Outros animais para você</h2>

          <p>Continue explorando e encontre seu par perfeito</p>
        </div>

        <Link className="related-animals-link" to="/#animals">
          Ver todos os animais
          <ChevronLeft />
        </Link>
      </div>

      <div className="related-animals-grid">
        {animals.map((animal) => {
          const primaryImage =
            animal.images.find((image) => image.isPrimary) ?? animal.images[0];

          return (
            <AnimalCard
              key={animal.id}
              name={animal.name}
              breed={animal.breed}
              age={formatAge(animal.ageInMonths)}
              city={animal.city}
              state={animal.state}
              species={animal.species}
              imageUrl={primaryImage ? `${API_URL}${primaryImage.url}` : ''}
              href={`/animals/${animal.id}`}
            />
          );
        })}
      </div>
    </section>
  );
}
