import { MapPin } from 'lucide-react';

import './ConfirmedAnimalCard.css';

interface ConfirmedAnimalCardProps {
  name: string;
  breed: string;
  city: string;
  state: string;
  imageUrl: string;
}

export function ConfirmedAnimalCard({
  name,
  breed,
  city,
  state,
  imageUrl,
}: ConfirmedAnimalCardProps) {
  return (
    <article className="confirmed-animal-card">
      <div className="confirmed-animal-card-image">
        <img src={imageUrl} alt={name} />
      </div>

      <div className="confirmed-animal-card-content">
        <h2>{name}</h2>

        <p className="confirmed-animal-card-breed">{breed}</p>

        <div className="confirmed-animal-card-divider" />

        <span className="confirmed-animal-card-location">
          <MapPin />
          {city} - {state}
        </span>
      </div>
    </article>
  );
}
