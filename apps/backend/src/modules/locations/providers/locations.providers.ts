import { BrazilianState } from 'src/common/enums/brazilian-state.enum';

export const LOCATIONS_PROVIDER = 'LOCATIONS_PROVIDER';

export interface LocationsProvider {
  validateCity(state: BrazilianState, city: string): Promise<boolean>;
  getCities(state: BrazilianState): Promise<string[]>;
}
