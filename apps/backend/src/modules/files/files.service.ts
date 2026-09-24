import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { Repository } from 'typeorm';

import { File } from './entities/file.entity';
import { STORAGE_PROVIDER } from './providers/storage.provider';
import type { StorageProvider } from './providers/storage.provider';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly filesRepository: Repository<File>,

    @Inject(STORAGE_PROVIDER)
    private readonly storageProvider: StorageProvider,
  ) {}

  async upload(file: Express.Multer.File): Promise<File> {
    const extension = extname(file.originalname);

    const storageKey = `files/${randomUUID()}${extension}`;

    await this.storageProvider.upload(file.buffer, storageKey, file.mimetype);

    const uploadedFile = this.filesRepository.create({
      storageKey,
      mimeType: file.mimetype,
      size: file.size,
    });

    return this.filesRepository.save(uploadedFile);
  }

  async findById(id: string): Promise<File> {
    const file = await this.filesRepository.findOne({
      where: { id },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file;
  }

  async delete(file: File): Promise<void> {
    await this.storageProvider.delete(file.storageKey);

    await this.filesRepository.remove(file);
  }

  getUrl(file: File): Promise<string> {
    return this.storageProvider.getUrl(file.storageKey);
  }
}
