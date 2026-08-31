import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdoptionRequest } from './entities/adoption-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdoptionRequest])],
  providers: [],
  exports: [],
})
export class AdoptionRequestsModule {}
