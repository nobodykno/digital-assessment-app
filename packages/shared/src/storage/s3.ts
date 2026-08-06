import { S3Client } from '@aws-sdk/client-s3';

/**
 * Configuration for s3client to directly upload file to minIo bucket
 */

const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
const s3Client = new S3Client({
  region: 'us-east-1',
  endpoint: `${protocol}://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`,
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY!,
    secretAccessKey: process.env.MINIO_SECRET_KEY!,
  },
  forcePathStyle: true,
});

export default s3Client;
