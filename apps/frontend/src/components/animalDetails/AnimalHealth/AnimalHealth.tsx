import { ShieldCheck, Stethoscope } from 'lucide-react';

import './AnimalHealth.css';

interface AnimalHealthProps {
  vaccinated: boolean;
  neutered: boolean;
}

export function AnimalHealth({ vaccinated, neutered }: AnimalHealthProps) {
  const careItems = [
    { label: 'Vacinado', active: vaccinated },
    { label: 'Castrado', active: neutered },
  ];

  return (
    <section className="animal-health">
      <h2>
        <Stethoscope />
        Saúde e Cuidados
      </h2>

      <ul className="animal-health-list">
        {careItems.map(({ label, active }) => (
          <li
            key={label}
            className={`animal-health-tag ${active ? 'active' : ''}`}
          >
            <ShieldCheck />
            {label}
          </li>
        ))}
      </ul>
    </section>
  );
}
