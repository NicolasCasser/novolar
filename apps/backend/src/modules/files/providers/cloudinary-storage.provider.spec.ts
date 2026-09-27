import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

import { CloudinaryStorageProvider } from './cloudinary-storage.provider';

jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload_stream: jest.fn(),
      destroy: jest.fn(),
    },
    url: jest.fn(),
  },
}));

describe('CloudinaryStorageProvider', () => {
  let provider: CloudinaryStorageProvider;
  let configService: jest.Mocked<ConfigService>;

  const mockConfig = {
    CLOUDINARY_CLOUD_NAME: 'test-cloud',
    CLOUDINARY_API_KEY: 'test-key',
    CLOUDINARY_API_SECRET: 'test-secret',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    configService = {
      getOrThrow: jest.fn(
        (key: string) => mockConfig[key as keyof typeof mockConfig],
      ),
    } as unknown as jest.Mocked<ConfigService>;
  });

  const createProvider = () => new CloudinaryStorageProvider(configService);

  it('should be defined', () => {
    provider = createProvider();
    expect(provider).toBeDefined();
  });

  describe('constructor', () => {
    it('should configure cloudinary with credentials from config', () => {
      createProvider();

      expect(cloudinary.config).toHaveBeenCalledTimes(1);
      expect(cloudinary.config).toHaveBeenCalledWith({
        cloud_name: 'test-cloud',
        api_key: 'test-key',
        api_secret: 'test-secret',
        secure: true,
      });
    });

    it('should throw if credentials are missing', () => {
      configService.getOrThrow.mockImplementation((key: string) => {
        if (key === 'CLOUDINARY_CLOUD_NAME') throw new Error('Missing');
        return mockConfig[key as keyof typeof mockConfig];
      });

      expect(() => createProvider()).toThrow('Missing');
    });
  });

  describe('upload', () => {
    beforeEach(() => {
      provider = createProvider();
    });

    it('should upload file to cloudinary with correct public_id', async () => {
      const file = Buffer.from('file content');
      const key = 'files/image.jpg';
      const mimeType = 'image/jpeg';

      const uploadStreamMock = {
        end: jest.fn((buffer: Buffer) => {
          expect(buffer).toBe(file);
        }),
      };

      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
        (_options: unknown, callback: (error?: Error) => void) => {
          callback();
          return uploadStreamMock;
        },
      );

      await provider.upload(file, key, mimeType);

      expect(cloudinary.uploader.upload_stream).toHaveBeenCalledTimes(1);
      expect(cloudinary.uploader.upload_stream).toHaveBeenCalledWith(
        expect.objectContaining({
          public_id: 'novolar/files/image.jpg',
          resource_type: 'image',
          overwrite: true,
        }),
        expect.any(Function),
      );
    });

    it('should reject when upload fails', async () => {
      const file = Buffer.from('file content');
      const key = 'files/image.jpg';

      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
        (_options: unknown, callback: (error?: Error) => void) => {
          callback(new Error('Upload failed'));
          return { end: jest.fn() };
        },
      );

      await expect(provider.upload(file, key, 'image/jpeg')).rejects.toThrow(
        'Upload failed',
      );
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      provider = createProvider();
    });

    it('should delete file from cloudinary with correct public_id', async () => {
      const key = 'files/image.jpg';

      (cloudinary.uploader.destroy as jest.Mock).mockImplementation(
        (
          _publicId: string,
          _options: unknown,
          callback: (error?: Error) => void,
        ) => {
          callback();
        },
      );

      await provider.delete(key);

      expect(cloudinary.uploader.destroy).toHaveBeenCalledTimes(1);
      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(
        'novolar/files/image.jpg',
        { resource_type: 'image' },
        expect.any(Function),
      );
    });

    it('should reject when deletion fails', async () => {
      const key = 'files/image.jpg';

      (cloudinary.uploader.destroy as jest.Mock).mockImplementation(
        (
          _publicId: string,
          _options: unknown,
          callback: (error?: Error) => void,
        ) => {
          callback(new Error('Deletion failed'));
        },
      );

      await expect(provider.delete(key)).rejects.toThrow('Deletion failed');
    });
  });

  describe('getUrl', () => {
    beforeEach(() => {
      provider = createProvider();
    });

    it('should return optimized cloudinary url', async () => {
      const key = 'files/image.jpg';
      const expectedUrl =
        'https://res.cloudinary.com/test-cloud/image/upload/f_auto,q_auto/v1/novolar/files/image.jpg';

      (cloudinary.url as jest.Mock).mockReturnValue(expectedUrl);

      const result = await provider.getUrl(key);

      expect(cloudinary.url).toHaveBeenCalledTimes(1);
      expect(cloudinary.url).toHaveBeenCalledWith('novolar/files/image.jpg', {
        resource_type: 'image',
        secure: true,
        transformation: [{ fetch_format: 'auto', quality: 'auto' }],
      });
      expect(result).toBe(expectedUrl);
    });
  });
});
