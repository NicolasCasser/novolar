import './AnimalCard.css';
import { Clock3, MapPin } from 'lucide-react';

import { SpeciesBadge } from '../../../ui/SpeciesBadge/SpeciesBadge';
import type { AnimalSpecies } from '../../../../utils/animals';

interface AnimalCardProps {
  name: string;
  breed: string;
  age: string;
  city: string;
  state: string;
  species: AnimalSpecies;
  imageUrl: string;
  href?: string;
}

export function AnimalCard({
  name,
  breed,
  age,
  city,
  state,
  species,
  imageUrl,
  href = '#',
}: AnimalCardProps) {
  return (
    <article className="animal-card">
      <div className="animal-card-image">
        <img src={imageUrl} alt={name} />

        <SpeciesBadge species={species} />
      </div>

      <div className="animal-card-content">
        <h3>{name}</h3>

        <p className="animal-card-breed">{breed}</p>

        <div className="animal-card-info">
          <span>
            <Clock3 />
            {age}
          </span>

          <span>
            <MapPin />
            {city}, {state}
          </span>
        </div>

        <a href={href}>Ver detalhes</a>
      </div>
    </article>
  );
}
