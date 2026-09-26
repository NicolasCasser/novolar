import type { LucideIcon } from 'lucide-react';

import './SummaryCards.css';

export interface SummaryCard {
  label: string;
  value: number;
  icon: LucideIcon;
}

interface SummaryCardsProps {
  items: SummaryCard[];
}

export function SummaryCards({ items }: SummaryCardsProps) {
  return (
    <ul className="summary-cards">
      {items.map(({ label, value, icon: Icon }) => (
        <li key={label} className="summary-card">
          <span className="summary-card-icon">
            <Icon />
          </span>

          <div>
            <span className="summary-card-label">{label}</span>

            <strong className="summary-card-value">{value}</strong>
          </div>
        </li>
      ))}
    </ul>
  );
}
