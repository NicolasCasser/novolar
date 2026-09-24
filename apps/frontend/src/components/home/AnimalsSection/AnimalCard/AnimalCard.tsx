import './AnimalCard.css';
import { Clock3, MapPin } from 'lucide-react';

interface AnimalCardProps {
  name: string;
  breed: string;
  age: string;
  city: string;
  state: string;
  species: string;
  imageUrl: string;
}

export function AnimalCard({
  name,
  breed,
  age,
  city,
  state,
  species,
  imageUrl,
}: AnimalCardProps) {
  return (
    <article className="animal-card">
      <div className="animal-card-image">
        <img src={imageUrl} alt={name} />

        <span className="animal-card-species">{species}</span>
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

        <a href="#">Ver detalhes</a>
      </div>
    </article>
  );
}
