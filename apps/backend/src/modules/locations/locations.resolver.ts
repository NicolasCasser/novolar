import { Args, Query, Resolver } from '@nestjs/graphql';

import { BrazilianState } from 'src/common/enums/brazilian-state.enum';
import { LocationsService } from './locations.service';

@Resolver()
export class LocationsResolver {
  constructor(private readonly locationsService: LocationsService) {}

  @Query(() => [String])
  async cities(
    @Args('state', { type: () => BrazilianState })
    state: BrazilianState,
  ): Promise<string[]> {
    return this.locationsService.getCities(state);
  }
}
