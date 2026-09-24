import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Animal } from './entities/animal.entity';
import { AnimalImage } from './entities/animal-image.entity';
import { AnimalsService } from './animals.service';
import { FilesModule } from '../files/files.module';
import { LocationsModule } from '../locations/locations.module';
import { AnimalsResolver } from './animals.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Animal, AnimalImage]),
    FilesModule,
    LocationsModule,
  ],
  providers: [AnimalsService, AnimalsResolver],
  exports: [AnimalsService],
})
export class AnimalsModule {}
