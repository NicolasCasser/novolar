import { Module } from '@nestjs/common';

import { LocationsResolver } from './locations.resolver';
import { LocationsService } from './locations.service';
import { IbgeLocationsProvider } from './providers/ibge-locations.provider';
import { LOCATIONS_PROVIDER } from './providers/locations.providers';

@Module({
  providers: [
    {
      provide: LOCATIONS_PROVIDER,
      useClass: IbgeLocationsProvider,
    },
    LocationsService,
    LocationsResolver,
  ],
  exports: [LOCATIONS_PROVIDER, LocationsService],
})
export class LocationsModule {}
