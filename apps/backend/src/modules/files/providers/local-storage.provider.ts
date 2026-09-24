import { Injectable } from '@nestjs/common';
import { mkdir, rm, writeFile } from 'fs/promises';
import { dirname, join } from 'path';

import { StorageProvider } from './storage.provider';

@Injectable()
export class LocalStorageProvider implements StorageProvider {
  private readonly storagePath = join(process.cwd(), 'uploads');

  async upload(file: Buffer, key: string, mimeType: string): Promise<void> {
    void mimeType;

    const filePath = join(this.storagePath, key);

    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, file);
  }

  async delete(key: string): Promise<void> {
    const filePath = join(this.storagePath, key);

    await rm(filePath, { force: true });
  }

  getUrl(key: string): Promise<string> {
    return Promise.resolve(`/uploads/${key}`);
  }
}
