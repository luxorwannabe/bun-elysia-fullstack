import { createHash } from 'node:crypto';
import type { StorageProvider } from './interface';

/**
 * CloudinaryProvider
 * 
 * Handles file storage using Cloudinary services.
 * Requires CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.
 * 
 * Note: This implementation uses the REST API via fetch to avoid 
 * mandatory SDK dependencies if not used.
 */
export class CloudinaryProvider implements StorageProvider {
  private cloudName: string;
  private apiKey: string;
  private apiSecret: string;
  private uploadPreset: string;

  constructor(cloudName: string, apiKey: string, apiSecret: string, uploadPreset: string = 'ml_default') {
    this.cloudName = cloudName;
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.uploadPreset = uploadPreset;
  }

  async upload(file: File | Blob, fileName?: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file, fileName || 'upload.webp');
    formData.append('upload_preset', this.uploadPreset);
    
    if (fileName) {
      formData.append('public_id', fileName.split('.')[0]);
    }

    // Standard Cloudinary Unsigned Upload (for simplicity in this example)
    // For production, signed uploads are recommended but require more setup
    const response = await fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Cloudinary upload failed: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    return data.secure_url;
  }

  async delete(fileUrl: string): Promise<void> {
    try {
      // Extract public_id from Cloudinary URL
      // Example URL: https://res.cloudinary.com/cloudname/image/upload/v12345/public_id.jpg
      const parts = fileUrl.split('/');
      const filenameWithExtension = parts[parts.length - 1];
      const publicId = filenameWithExtension.split('.')[0];
      
      const timestamp = Math.round(new Date().getTime() / 1000);
      
      // Calculate signature for the destroy call
      // Signature must be: sha1("public_id=xxx&timestamp=xxx" + api_secret)
      const dataToSign = `public_id=${publicId}&timestamp=${timestamp}${this.apiSecret}`;
      const signature = createHash('sha1').update(dataToSign).digest('hex');

      const formData = new FormData();
      formData.append('public_id', publicId);
      formData.append('timestamp', timestamp.toString());
      formData.append('api_key', this.apiKey);
      formData.append('signature', signature);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/destroy`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Cloudinary delete failed:', error);
      }
    } catch (error) {
      console.error('Error during Cloudinary deletion:', error);
    }
  }
}
