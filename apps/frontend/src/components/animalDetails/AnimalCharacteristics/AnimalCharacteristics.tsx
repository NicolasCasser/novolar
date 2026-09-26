import { Calendar, Info, Mars, User, Venus, Weight } from 'lucide-react';

import { sexLabels, sizeLabels, speciesLabels } from '../../../utils/animals';
import type {
  AnimalSex,
  AnimalSize,
  AnimalSpecies,
} from '../../../utils/animals';

import './AnimalCharacteristics.css';

interface AnimalCharacteristicsProps {
  species: AnimalSpecies;
  breed: string;
  sex: AnimalSex;
  age: string;
  size: AnimalSize;
}

export function AnimalCharacteristics({
  species,
  breed,
  sex,
  age,
  size,
}: AnimalCharacteristicsProps) {
  const characteristics = [
    {
      label: 'ESPÉCIE',
      value: speciesLabels[species],
      icon: User,
    },
    {
      label: 'RAÇA',
      value: breed,
      icon: Info,
    },
    {
      label: 'SEXO',
      value: sexLabels[sex],
      icon: sex === 'FEMALE' ? Venus : Mars,
    },
    {
      label: 'IDADE',
      value: age,
      icon: Calendar,
    },
    {
      label: 'PORTE',
      value: sizeLabels[size],
      icon: Weight,
    },
  ];

  return (
    <ul className="animal-characteristics">
      {characteristics.map(({ label, value, icon: Icon }) => (
        <li key={label} className="animal-characteristic">
          <span className="animal-characteristic-icon">
            <Icon />
          </span>

          <span className="animal-characteristic-content">
            <span className="animal-characteristic-label">{label}</span>

            <span className="animal-characteristic-value">{value}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
