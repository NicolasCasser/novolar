import { ClipboardList, Heart, PawPrint } from 'lucide-react';

import './StatCards.css';

interface StatCardsProps {
  registeredAnimals: number;
  availableAnimals: number;
  pendingRequests: number;
  error: string;
}

export function StatCards({
  registeredAnimals,
  availableAnimals,
  pendingRequests,
  error,
}: StatCardsProps) {
  const cards = [
    {
      label: 'ANIMAIS CADASTRADOS',
      value: registeredAnimals,
      icon: PawPrint,
    },
    {
      label: 'ANIMAIS DISPONÍVEIS',
      value: availableAnimals,
      icon: Heart,
    },
    {
      label: 'SOLICITAÇÕES PENDENTES',
      value: pendingRequests,
      icon: ClipboardList,
    },
  ];

  return (
    <>
      <ul className="stat-cards">
        {cards.map(({ label, value, icon: Icon }) => (
          <li key={label} className="stat-card">
            <div className="stat-card-content">
              <span className="stat-card-label">{label}</span>

              <strong className="stat-card-value">{value}</strong>
            </div>

            <span className="stat-card-icon">
              <Icon />
            </span>
          </li>
        ))}
      </ul>

      {error && <p className="stat-cards-error">{error}</p>}
    </>
  );
}
