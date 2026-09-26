import { ChevronRight, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

import { speciesLabels } from '../../../utils/animals';
import type { AnimalSpecies } from '../../../utils/animals';
import { formatDate } from '../../../utils/date';

import './RecentAnimals.css';

export type RecentAnimal = {
  id: string;
  name: string;
  species: AnimalSpecies;
  city: string;
  state: string;
  createdAt: string;
  imageUrl: string;
};

interface RecentAnimalsProps {
  animals: RecentAnimal[];
  error: string;
}

export function RecentAnimals({ animals, error }: RecentAnimalsProps) {
  return (
    <section className="recent-animals">
      <div className="recent-animals-header">
        <h2>Animais recém cadastrados</h2>

        <p>Novos pets que entraram na plataforma.</p>
      </div>

      {error ? (
        <p className="recent-animals-error">{error}</p>
      ) : (
        <ul className="recent-animals-list">
          {animals.map((animal) => (
            <li key={animal.id} className="recent-animal">
              <div className="recent-animal-image">
                <img src={animal.imageUrl} alt={animal.name} />
              </div>

              <div className="recent-animal-content">
                <div className="recent-animal-top">
                  <span className="recent-animal-name">{animal.name}</span>

                  <span className="recent-animal-species">
                    {speciesLabels[animal.species]}
                  </span>
                </div>

                <div className="recent-animal-meta">
                  <span>
                    <MapPin />
                    {animal.city}
                  </span>

                  <span>
                    <Clock />
                    {formatDate(animal.createdAt)}
                  </span>
                </div>
              </div>
            </li>
          ))}

          {animals.length === 0 && (
            <li className="recent-animals-error">Nenhum animal cadastrado.</li>
          )}
        </ul>
      )}

      <div className="recent-animals-footer">
        <Link className="recent-animals-link" to="/dashboard/animais">
          Gerenciar catálogo
          <ChevronRight />
        </Link>
      </div>
    </section>
  );
}
