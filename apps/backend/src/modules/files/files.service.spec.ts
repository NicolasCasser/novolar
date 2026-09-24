import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { FilesService } from './files.service';
import { File } from './entities/file.entity';
import { STORAGE_PROVIDER } from './providers/storage.provider';

describe('FilesService', () => {
  let service: FilesService;

  const filesRepositoryMock = {
    create: jest.fn<
      File,
      [
        {
          storageKey: string;
          mimeType: string;
          size: number;
        },
      ]
    >(),
    save: jest.fn<Promise<File>, [File]>(),
    findOne: jest.fn<Promise<File | null>, [unknown]>(),
    remove: jest.fn(),
  };

  const storageProviderMock = {
    upload: jest.fn(),
    delete: jest.fn(),
    getUrl: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        {
          provide: getRepositoryToken(File),
          useValue: filesRepositoryMock,
        },
        {
          provide: STORAGE_PROVIDER,
          useValue: storageProviderMock,
        },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('upload', () => {
    it('should upload and save a file', async () => {
      const file = {
        originalname: 'photo.jpg',
        buffer: Buffer.from('file content'),
        mimetype: 'image/jpeg',
        size: 1234,
      } as Express.Multer.File;

      const createdFile = {
        storageKey: 'files/generated-uuid.jpg',
        mimeType: 'image/jpeg',
        size: 1234,
      } as File;

      const savedFile = {
        ...createdFile,
        id: 'file-1',
      };

      storageProviderMock.upload.mockResolvedValue(undefined);
      filesRepositoryMock.create.mockReturnValue(createdFile);
      filesRepositoryMock.save.mockResolvedValue(savedFile);

      const result = await service.upload(file);

      expect(result).toEqual(savedFile);

      expect(storageProviderMock.upload).toHaveBeenCalledTimes(1);
      expect(storageProviderMock.upload).toHaveBeenCalledWith(
        file.buffer,
        expect.stringMatching(/^files\/.+\.jpg$/),
        file.mimetype,
      );

      expect(filesRepositoryMock.create).toHaveBeenCalledTimes(1);

      const createCall = filesRepositoryMock.create.mock.calls[0][0];

      expect(typeof createCall.storageKey).toBe('string');
      expect(createCall.storageKey).toMatch(/^files\/.+\.jpg$/);
      expect(createCall.mimeType).toBe(file.mimetype);
      expect(createCall.size).toBe(file.size);

      expect(filesRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(filesRepositoryMock.save).toHaveBeenCalledWith(createdFile);
    });

    it('should throw when storage upload fails', async () => {
      const file = {
        originalname: 'photo.jpg',
        buffer: Buffer.from('file content'),
        mimetype: 'image/jpeg',
        size: 1234,
      } as Express.Multer.File;

      storageProviderMock.upload.mockRejectedValue(
        new Error('Storage upload failed'),
      );

      await expect(service.upload(file)).rejects.toThrow(
        'Storage upload failed',
      );

      expect(storageProviderMock.upload).toHaveBeenCalledTimes(1);
      expect(filesRepositoryMock.create).not.toHaveBeenCalled();
      expect(filesRepositoryMock.save).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a file by id', async () => {
      const file = {
        id: 'file-1',
        storageKey: 'files/image.jpg',
        mimeType: 'image/jpeg',
        size: 1234,
      } as File;

      filesRepositoryMock.findOne.mockResolvedValue(file);

      const result = await service.findById('file-1');

      expect(result).toEqual(file);

      expect(filesRepositoryMock.findOne).toHaveBeenCalledTimes(1);
      expect(filesRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: 'file-1' },
      });
    });

    it('should throw when the file is not found', async () => {
      filesRepositoryMock.findOne.mockResolvedValue(null);

      await expect(service.findById('file-1')).rejects.toThrow(
        new NotFoundException('File not found'),
      );

      expect(filesRepositoryMock.findOne).toHaveBeenCalledTimes(1);
      expect(filesRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: 'file-1' },
      });
    });
  });

  describe('delete', () => {
    it('should delete the file from storage and database', async () => {
      const file = {
        id: 'file-1',
        storageKey: 'files/image.jpg',
        mimeType: 'image/jpeg',
        size: 1234,
      } as File;

      storageProviderMock.delete.mockResolvedValue(undefined);
      filesRepositoryMock.remove.mockResolvedValue(file);

      await service.delete(file);

      expect(storageProviderMock.delete).toHaveBeenCalledTimes(1);
      expect(storageProviderMock.delete).toHaveBeenCalledWith(file.storageKey);

      expect(filesRepositoryMock.remove).toHaveBeenCalledTimes(1);
      expect(filesRepositoryMock.remove).toHaveBeenCalledWith(file);

      expect(
        storageProviderMock.delete.mock.invocationCallOrder[0],
      ).toBeLessThan(filesRepositoryMock.remove.mock.invocationCallOrder[0]);
    });

    it('should not remove the file from database when storage deletion fails', async () => {
      const file = {
        id: 'file-1',
        storageKey: 'files/image.jpg',
      } as File;

      storageProviderMock.delete.mockRejectedValue(
        new Error('Storage deletion failed'),
      );

      await expect(service.delete(file)).rejects.toThrow(
        'Storage deletion failed',
      );

      expect(storageProviderMock.delete).toHaveBeenCalledWith(file.storageKey);
      expect(filesRepositoryMock.remove).not.toHaveBeenCalled();
    });
  });

  describe('getUrl', () => {
    it('should return the file url', async () => {
      const file = {
        id: 'file-1',
        storageKey: 'files/image.jpg',
      } as File;

      storageProviderMock.getUrl.mockResolvedValue('/uploads/files/image.jpg');

      const result = await service.getUrl(file);

      expect(result).toBe('/uploads/files/image.jpg');

      expect(storageProviderMock.getUrl).toHaveBeenCalledTimes(1);
      expect(storageProviderMock.getUrl).toHaveBeenCalledWith(file.storageKey);
    });
  });
});
