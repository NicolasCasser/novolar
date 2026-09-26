export type AnimalSpecies = 'DOG' | 'CAT' | 'BIRD' | 'RABBIT' | 'OTHER';

export type AnimalSize = 'SMALL' | 'MEDIUM' | 'LARGE';

export type AnimalSex = 'MALE' | 'FEMALE';

export type AnimalStatus = 'AVAILABLE' | 'ADOPTED';

export const speciesLabels: Record<AnimalSpecies, string> = {
  DOG: 'Cachorro',
  CAT: 'Gato',
  BIRD: 'Ave',
  RABBIT: 'Coelho',
  OTHER: 'Outro',
};

export const sizeLabels: Record<AnimalSize, string> = {
  SMALL: 'Pequeno',
  MEDIUM: 'Médio',
  LARGE: 'Grande',
};

export const sexLabels: Record<AnimalSex, string> = {
  MALE: 'Macho',
  FEMALE: 'Fêmea',
};

export const statusLabels: Record<AnimalStatus, string> = {
  AVAILABLE: 'Disponível',
  ADOPTED: 'Adotado',
};

export function formatAge(ageInMonths: number): string {
  if (ageInMonths < 12) {
    return `${ageInMonths} ${ageInMonths === 1 ? 'mês' : 'meses'}`;
  }

  const years = Math.floor(ageInMonths / 12);
  const months = ageInMonths % 12;

  if (months === 0) {
    return `${years} ${years === 1 ? 'ano' : 'anos'}`;
  }

  return `${years} ${years === 1 ? 'ano' : 'anos'} e ${months} ${
    months === 1 ? 'mês' : 'meses'
  }`;
}
