import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { Injectable } from '@nestjs/common';

import { StorageProvider } from './storage.provider';

@Injectable()
export class CloudinaryStorageProvider implements StorageProvider {
  private readonly folder = 'novolar';

  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.getOrThrow('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.getOrThrow('CLOUDINARY_API_KEY'),
      api_secret: this.configService.getOrThrow('CLOUDINARY_API_SECRET'),
      secure: true,
    });
  }

  async upload(file: Buffer, key: string, mimeType: string): Promise<void> {
    void mimeType;

    const publicId = `${this.folder}/${key}`;

    return new Promise<void>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id: publicId,
          resource_type: 'image',
          overwrite: true,
        },
        (error) => {
          if (error) {
            const message =
              error instanceof Error ? error.message : 'Unknown upload error';
            reject(new Error(message));
          } else {
            resolve();
          }
        },
      );

      void uploadStream.end(file);
    });
  }

  async delete(key: string): Promise<void> {
    const publicId = `${this.folder}/${key}`;

    return new Promise<void>((resolve, reject) => {
      void cloudinary.uploader.destroy(
        publicId,
        { resource_type: 'image' },
        (error) => {
          if (error) {
            const message =
              error instanceof Error ? error.message : 'Unknown deletion error';
            reject(new Error(message));
          } else {
            resolve();
          }
        },
      );
    });
  }

  getUrl(key: string): Promise<string> {
    const publicId = `${this.folder}/${key}`;

    const url = cloudinary.url(publicId, {
      resource_type: 'image',
      secure: true,
      transformation: [{ fetch_format: 'auto', quality: 'auto' }],
    });

    return Promise.resolve(url);
  }
}
