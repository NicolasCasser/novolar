import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FilesController } from './files.controller';
import { File } from './entities/file.entity';
import { FilesService } from './files.service';
import { LocalStorageProvider } from './providers/local-storage.provider';
import { STORAGE_PROVIDER } from './providers/storage.provider';

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  controllers: [FilesController],
  providers: [
    FilesService,
    {
      provide: STORAGE_PROVIDER,
      useClass: LocalStorageProvider,
    },
  ],
  exports: [FilesService],
})
export class FilesModule {}
