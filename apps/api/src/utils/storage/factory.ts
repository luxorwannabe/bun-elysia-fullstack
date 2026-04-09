import type { StorageProvider } from './interface';
import { LocalProvider } from './local';
import { CloudinaryProvider } from './cloudinary';
import { S3Provider } from './s3';

/**
 * StorageFactory
 * 
 * Factory responsible for instantiating the correct storage provider
 * based on environment variables.
 */
export class StorageFactory {
  private static instance: StorageProvider;

  static getProvider(): StorageProvider {
    if (this.instance) return this.instance;

    const providerType = (process.env.STORAGE_PROVIDER || 'local').toLowerCase();

    switch (providerType) {
      case 'cloudinary':
        this.instance = new CloudinaryProvider(
          process.env.CLOUDINARY_CLOUD_NAME || '',
          process.env.CLOUDINARY_API_KEY || '',
          process.env.CLOUDINARY_API_SECRET || '',
          process.env.CLOUDINARY_UPLOAD_PRESET || 'ml_default'
        );
        break;
      
      case 's3':
        this.instance = new S3Provider(
          process.env.S3_ENDPOINT || '',
          process.env.S3_REGION || 'us-east-1',
          process.env.S3_BUCKET || '',
          process.env.S3_ACCESS_KEY_ID || '',
          process.env.S3_SECRET_ACCESS_KEY || '',
          process.env.S3_PUBLIC_URL || ''
        );
        break;

      case 'local':
      default:
        this.instance = new LocalProvider(
          process.env.LOCAL_STORAGE_PATH || 'public/uploads',
          process.env.LOCAL_STORAGE_BASE_URL || '/uploads'
        );
        break;
    }

    return this.instance;
  }
}

/**
 * Export a ready-to-use storage instance
 */
export const storage = StorageFactory.getProvider();
