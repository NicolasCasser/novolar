import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdoptionRequest } from './entities/adoption-request.entity';
import { AnimalsModule } from '../animals/animals.module';
import { LocationsModule } from '../locations/locations.module';
import { AdoptionRequestsResolver } from './adoption-requests.resolver';
import { AdoptionRequestsService } from './adoption-requests.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdoptionRequest]),
    AnimalsModule,
    LocationsModule,
  ],
  providers: [AdoptionRequestsResolver, AdoptionRequestsService],
  exports: [AdoptionRequestsService],
})
export class AdoptionRequestsModule {}
