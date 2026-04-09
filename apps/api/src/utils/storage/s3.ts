import type { StorageProvider } from './interface';
import { signS3Request } from './s3-signer';

/**
 * S3Provider (SDK-less Implementation)
 * 
 * Handles file storage using the S3 REST API and manual Signature V4 signing.
 * No external AWS SDK dependency required.
 */
export class S3Provider implements StorageProvider {
  private endpoint: string;
  private region: string;
  private bucket: string;
  private accessKey: string;
  private secretKey: string;
  private publicUrl: string;

  constructor(
    endpoint: string,
    region: string,
    bucket: string,
    accessKey: string,
    secretKey: string,
    publicUrl: string
  ) {
    this.endpoint = endpoint || `https://${bucket}.s3.${region}.amazonaws.com`;
    this.region = region;
    this.bucket = bucket;
    this.accessKey = accessKey;
    this.secretKey = secretKey;
    this.publicUrl = publicUrl || this.endpoint;
  }

  async upload(file: File | Blob, fileName?: string): Promise<string> {
    const timestamp = Date.now();
    const originalName = (file as File).name || 'avatar.png';
    const extension = originalName.split('.').pop();
    const finalFileName = fileName || `avatar-${timestamp}.${extension}`;
    
    // Construct the target URL correctly with the bucket name
    const baseUrl = this.endpoint.endsWith('/') ? this.endpoint.slice(0, -1) : this.endpoint;
    
    // Use path-style as it's more universal for different providers (S3/R2/Spaces)
    // Format: https://endpoint.com/bucket-name/file-name
    const uploadUrl = `${baseUrl}/${this.bucket}/${finalFileName}`;

    // Get the array buffer to calculate payload hash if needed (optional for S3 but recommended)
    const arrayBuffer = await file.arrayBuffer();
    
    // Sign the request
    const authHeaders = await signS3Request({
      method: 'PUT',
      url: uploadUrl,
      region: this.region,
      accessKey: this.accessKey,
      secretKey: this.secretKey,
      payloadHash: 'UNSIGNED-PAYLOAD' // For simplicity, we use unsigned payload in this example
    });

    // Send the PUT request using fetch
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        ...authHeaders,
        'Content-Type': file.type || 'application/octet-stream',
      },
      body: arrayBuffer,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`S3 upload failed (${response.status}): ${errorText}`);
    }

    // Return the public URL
    const publicBaseUrl = this.publicUrl.endsWith('/') ? this.publicUrl.slice(0, -1) : this.publicUrl;
    return `${publicBaseUrl}/${finalFileName}`;
  }

  async delete(fileUrl: string): Promise<void> {
    const fileName = fileUrl.split('/').pop();
    if (!fileName) return;

    const baseUrl = this.endpoint.endsWith('/') ? this.endpoint.slice(0, -1) : this.endpoint;
    const deleteUrl = `${baseUrl}/${this.bucket}/${fileName}`;

    const authHeaders = await signS3Request({
      method: 'DELETE',
      url: deleteUrl,
      region: this.region,
      accessKey: this.accessKey,
      secretKey: this.secretKey,
      payloadHash: 'UNSIGNED-PAYLOAD'
    });

    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: authHeaders,
    });

    if (!response.ok && response.status !== 404) {
      const errorText = await response.text();
      throw new Error(`S3 delete failed (${response.status}): ${errorText}`);
    }
  }
}
