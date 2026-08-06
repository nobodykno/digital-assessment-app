import crypto from 'crypto';
import path from 'path';

const generateVideoThumbnail = (userId: number, fileId: number, tempThumbnailPath: string) => {
  return `users/${userId}/images/${fileId}/thumbnails/video/${crypto.randomUUID()}-${path.basename(tempThumbnailPath)}`;
};

const generateVIdeoQuality = (
  userId: number,
  fileId: number,
  quality: string,
  tempPath: string,
) => {
  return `users/${userId}/videos/${fileId}/${quality}/${crypto.randomUUID()}-${path.basename(
    tempPath,
  )}`;
};

const generateVIdeo = (userId: number, fileId: number, fileName: string) => {
  return `users/${userId}/videos/${fileId}/${fileName}`;
};

const generateImageAndDocument = (userId: number, type: string, extension: string) => {
  return `users/${userId}/${type}/${crypto.randomUUID()}${extension}`;
};

const objectNameDirectory = {
  generateVideoThumbnail,
  generateVIdeoQuality,
  generateVIdeo,
  generateImageAndDocument,
};

export default objectNameDirectory;
