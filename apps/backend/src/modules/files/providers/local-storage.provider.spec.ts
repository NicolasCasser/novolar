import { mkdir, rm, writeFile } from 'fs/promises';

import { Test, TestingModule } from '@nestjs/testing';

import { LocalStorageProvider } from './local-storage.provider';

jest.mock('fs/promises', () => ({
  mkdir: jest.fn(),
  writeFile: jest.fn(),
  rm: jest.fn(),
}));

describe('LocalStorageProvider', () => {
  let provider: LocalStorageProvider;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalStorageProvider],
    }).compile();

    provider = module.get<LocalStorageProvider>(LocalStorageProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('upload', () => {
    it('should create the directory and write the file', async () => {
      const file = Buffer.from('file content');
      const key = 'files/image.jpg';

      await provider.upload(file, key, 'image/jpeg');

      expect(mkdir).toHaveBeenCalledTimes(1);
      expect(mkdir).toHaveBeenCalledWith(expect.stringContaining('uploads'), {
        recursive: true,
      });

      expect(writeFile).toHaveBeenCalledTimes(1);
      expect(writeFile).toHaveBeenCalledWith(
        expect.stringContaining('uploads'),
        file,
      );
    });
  });

  describe('delete', () => {
    it('should remove the file', async () => {
      const key = 'files/image.jpg';

      await provider.delete(key);

      expect(rm).toHaveBeenCalledTimes(1);
      expect(rm).toHaveBeenCalledWith(expect.stringContaining('uploads'), {
        force: true,
      });
    });
  });

  describe('getUrl', () => {
    it('should return the file url', async () => {
      const result = await provider.getUrl('files/image.jpg');

      expect(result).toBe('/uploads/files/image.jpg');
    });
  });
});
