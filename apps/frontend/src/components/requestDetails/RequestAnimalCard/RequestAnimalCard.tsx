import { MapPin, User, PawPrint } from 'lucide-react';
import { Link } from 'react-router-dom';

import { sexLabels, sizeLabels } from '../../../utils/animals';
import type {
  AnimalSex,
  AnimalSize,
  AnimalSpecies,
} from '../../../utils/animals';

import './RequestAnimalCard.css';

import { SpeciesBadge } from '../../ui/SpeciesBadge/SpeciesBadge';

interface RequestAnimalCardProps {
  animalId: string;
  name: string;
  breed: string;
  species: AnimalSpecies;
  sex: AnimalSex;
  size: AnimalSize;
  age: string;
  city: string;
  state: string;
  imageUrl: string;
}

export function RequestAnimalCard({
  animalId,
  name,
  breed,
  species,
  sex,
  size,
  age,
  city,
  state,
  imageUrl,
}: RequestAnimalCardProps) {
  const characteristics = [
    { label: 'SEXO', value: sexLabels[sex] },
    { label: 'IDADE', value: age },
    { label: 'PORTE', value: sizeLabels[size] },
  ];

  return (
    <section className="request-animal-card">
      <h2 className="request-animal-card-title">
        <PawPrint />
        Informações do Animal
      </h2>

      <div className="request-animal-card-image">
        <img src={imageUrl} alt={name} />
      </div>

      <div className="request-animal-card-body">
        <div className="request-animal-card-head">
          <div>
            <span className="request-animal-card-name">{name}</span>

            <p className="request-animal-card-breed">{breed}</p>
          </div>

          <SpeciesBadge species={species} />
        </div>

        <div className="request-animal-card-divider" />

        <ul className="request-animal-card-characteristics">
          {characteristics.map(({ label, value }) => (
            <li key={label}>
              <span className="request-animal-card-label">{label}</span>

              <span className="request-animal-card-value">{value}</span>
            </li>
          ))}

          <li>
            <span className="request-animal-card-label">LOCALIZAÇÃO</span>

            <span className="request-animal-card-value request-animal-card-location">
              <MapPin />
              {city} - {state}
            </span>
          </li>
        </ul>

        <Link className="request-animal-card-link" to={`/animals/${animalId}`}>
          <User />
          Ver perfil completo
        </Link>
      </div>
    </section>
  );
}
