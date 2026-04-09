import { join } from 'path';
import { mkdir } from 'node:fs/promises';
import type { StorageProvider } from './interface';

/**
 * LocalProvider
 * 
 * Handles file storage on the local filesystem.
 * Useful for development and self-hosted environments.
 */
export class LocalProvider implements StorageProvider {
  private uploadDir: string;
  private baseUrl: string;

  constructor(uploadDir: string = 'public/uploads', baseUrl: string = '/uploads') {
    this.uploadDir = uploadDir;
    // Ensure the base URL is formatted correctly for concatenating
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  }

  /**
   * Ensure the upload directory exists
   */
  private async ensureDir() {
    try {
      await mkdir(this.uploadDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create upload directory:', error);
    }
  }

  /**
   * Uploads a file to the local filesystem
   */
  async upload(file: File | Blob, fileName?: string): Promise<string> {
    await this.ensureDir();

    // Use provided name or generate a safe one
    const timestamp = Date.now();
    const originalName = (file as File).name || 'avatar.png';
    const extension = originalName.split('.').pop();
    const finalFileName = fileName || `avatar-${timestamp}.${extension}`;
    
    const filePath = join(this.uploadDir, finalFileName);

    // Using Bun.write for high performance
    await Bun.write(filePath, await file.arrayBuffer());

    // Return the relative URL string
    return `${this.baseUrl}/${finalFileName}`;
  }

  /**
   * Deletes a file from the local filesystem
   */
  async delete(fileUrl: string): Promise<void> {
    const fileName = fileUrl.split('/').pop();
    if (!fileName) return;

    const filePath = join(this.uploadDir, fileName);
    try {
      const file = Bun.file(filePath);
      if (await file.exists()) {
        const { unlink } = require('node:fs/promises');
        await unlink(filePath);
      }
    } catch (error) {
      console.error('Failed to delete local file:', error);
    }
  }
}
