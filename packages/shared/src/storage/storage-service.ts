

import type { Readable } from 'stream';
import minioClient from './minio.js';
import { IUploadResult } from '../dto/upload-file-dto.js';



const bucket = process.env.MINIO_BUCKET!;

const storageService = {
  /**
   * Uploads an object to MinIO.
   *
   * Stores the object in the configured bucket and returns its metadata.
   *
   * @param objectName - Destination object key in the bucket.
   * @param data - File content as a Buffer or Readable stream.
   * @param mimeType - MIME type of the object.
   * @param originalName - Original file name. Defaults to the object name.
   * @returns Uploaded object metadata.
   */
  async upload(
    objectName: string,
    data: Buffer | Readable,
    mimeType: string,
    originalName = objectName,
  ): Promise<IUploadResult> {
    const uploadResult = await minioClient.putObject(
      bucket,
      objectName,
      data,
      Buffer.isBuffer(data) ? data.length : undefined,
      {
        'Content-Type': mimeType,
      },
    );

    const stat = await minioClient.statObject(bucket, objectName);

    return {
      objectName,
      originalName,
      mimeType,
      size: stat.size,
      etag: uploadResult.etag,
      url: objectName,
    };
  },

  /**
   * Retrieves an object as a readable stream.
   *
   * @param objectName - Object key in the bucket.
   * @returns Readable stream containing the object data.
   */
  async getObject(objectName: string) {
    return minioClient.getObject(bucket, objectName);
  },

  /**
   * Generates a presigned URL for downloading an object.
   *
   * The generated URL is valid for one hour.
   *
   * @param objectName - Object key in the bucket.
   * @returns Presigned download URL.
   */
  async getObjectUrl(objectName: string, name: string) {
    return minioClient.presignedGetObject(bucket, objectName, 60 * 60,     {
      'response-content-disposition': `attachment; filename="${name}"`,
    },);
  },

  /**
   * Deletes an object from the bucket.
   *
   * @param objectName - Object key to delete.
   * @returns A promise that resolves when the object is removed.
   */
  async deleteObject(objectName: string) {
    await minioClient.removeObject(bucket, objectName);
  },


};

export default storageService;
