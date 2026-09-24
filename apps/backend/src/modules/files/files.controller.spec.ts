import { Test, TestingModule } from '@nestjs/testing';

import { FilesController } from './files.controller';
import { FilesService } from './files.service';

describe('FilesController', () => {
  let controller: FilesController;

  const filesServiceMock = {
    upload: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        {
          provide: FilesService,
          useValue: filesServiceMock,
        },
      ],
    }).compile();

    controller = module.get<FilesController>(FilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('upload', () => {
    it('should upload a file', async () => {
      const file = {
        originalname: 'photo.jpg',
        buffer: Buffer.from('file content'),
        mimetype: 'image/jpeg',
        size: 1234,
      } as Express.Multer.File;

      const uploadedFile = {
        id: 'file-1',
        storageKey: 'files/image.jpg',
        mimeType: 'image/jpeg',
        size: 1234,
      };

      filesServiceMock.upload.mockResolvedValue(uploadedFile);

      const result = await controller.upload(file);

      expect(result).toEqual(uploadedFile);

      expect(filesServiceMock.upload).toHaveBeenCalledTimes(1);
      expect(filesServiceMock.upload).toHaveBeenCalledWith(file);
    });
  });
});
