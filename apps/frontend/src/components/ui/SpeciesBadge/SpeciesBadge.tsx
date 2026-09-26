import { speciesLabels } from '../../../utils/animals';
import type { AnimalSpecies } from '../../../utils/animals';

import './SpeciesBadge.css';

interface SpeciesBadgeProps {
  species: AnimalSpecies;
}

export function SpeciesBadge({ species }: SpeciesBadgeProps) {
  return <span className="species-badge">{speciesLabels[species]}</span>;
}
