/**
 * StorageProvider Interface
 * 
 * Defines the standard contract for all storage engines (Local, S3, Cloudinary).
 * All comments in this file are in English as per requirements.
 */
export interface StorageProvider {
  /**
   * Uploads a file to the storage provider.
   * @param file The file to upload (should be an Elysia file or standard File)
   * @param fileName Optional custom filename
   * @returns Promise containing the public URL of the uploaded file
   */
  upload(file: File | Blob, fileName?: string): Promise<string>;

  /**
   * Deletes a file from the storage provider.
   * @param fileUrl The full URL of the file to delete
   */
  delete(fileUrl: string): Promise<void>;
}
