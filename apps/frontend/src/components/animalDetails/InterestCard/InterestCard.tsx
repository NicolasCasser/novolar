import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

import './InterestCard.css';

interface InterestCardProps {
  animalId: string;
  name: string;
}

export function InterestCard({ animalId, name }: InterestCardProps) {
  return (
    <section className="interest-card">
      <div className="interest-card-header">
        <span className="interest-card-icon">
          <Heart />
        </span>

        <div className="interest-card-text">
          <h2>Interessado no {name}?</h2>

          <p>
            Preencha o formulário de interesse e nossa equipe entrará em
            contato.
          </p>
        </div>
      </div>

      <Link
        className="interest-card-button"
        to={`/animals/${animalId}/interesse`}
      >
        Tenho interesse
      </Link>
    </section>
  );
}
