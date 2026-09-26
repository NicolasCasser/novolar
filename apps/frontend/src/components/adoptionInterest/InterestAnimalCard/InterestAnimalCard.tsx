import { Info, MapPin } from 'lucide-react';

import { speciesLabels } from '../../../utils/animals';
import type { AnimalSpecies } from '../../../utils/animals';

import './InterestAnimalCard.css';

interface InterestAnimalCardProps {
  name: string;
  breed: string;
  species: AnimalSpecies;
  city: string;
  state: string;
  imageUrl: string;
}

export function InterestAnimalCard({
  name,
  breed,
  species,
  city,
  state,
  imageUrl,
}: InterestAnimalCardProps) {
  return (
    <article className="interest-animal-card">
      <div className="interest-animal-card-image">
        <img src={imageUrl} alt={name} />

        <span className="interest-animal-card-species">
          {speciesLabels[species]}
        </span>
      </div>

      <div className="interest-animal-card-content">
        <h2>{name}</h2>

        <p className="interest-animal-card-breed">{breed}</p>

        <span className="interest-animal-card-location">
          <MapPin />
          {city} - {state}
        </span>

        <div className="interest-animal-card-note">
          <Info />

          <p>
            Seu interesse será enviado para a equipe responsável pela adoção
            deste animal.
          </p>
        </div>
      </div>
    </article>
  );
}
