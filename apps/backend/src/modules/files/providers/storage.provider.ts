export const STORAGE_PROVIDER = 'STORAGE_PROVIDER';

export interface StorageProvider {
  upload(file: Buffer, key: string, mimeType: string): Promise<void>;

  delete(key: string): Promise<void>;

  getUrl(key: string): Promise<string>;
}
