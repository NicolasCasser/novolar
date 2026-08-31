import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Animal } from './entities/animal.entity';
import { AnimalImage } from './entities/animal-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Animal, AnimalImage])],
  providers: [],
  exports: [],
})
export class AnimalsModule {}
