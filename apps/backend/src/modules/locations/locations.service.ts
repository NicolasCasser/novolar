import { Inject, Injectable } from '@nestjs/common';

import { BrazilianState } from 'src/common/enums/brazilian-state.enum';
import {
  LOCATIONS_PROVIDER,
  type LocationsProvider,
} from './providers/locations.providers';

@Injectable()
export class LocationsService {
  constructor(
    @Inject(LOCATIONS_PROVIDER)
    private readonly locationsProvider: LocationsProvider,
  ) {}

  async validateCity(state: BrazilianState, city: string): Promise<boolean> {
    return this.locationsProvider.validateCity(state, city);
  }

  async getCities(state: BrazilianState): Promise<string[]> {
    return this.locationsProvider.getCities(state);
  }
}
