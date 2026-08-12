import path from 'path';

import busboy from 'busboy';

import FILE_CONSTANTS from '@dam/shared/constants'
import logger from '../logger/index.js';
import objectNameDirectory from '../object/dam-object.js';
import serviceStorage from '@dam/shared/storage';

import { AppError } from './app-error.js';

import type { NextFunction, Request, Response } from 'express';

/**
 *
 * @param req
 * @param res
 * @param next
 *
 * Upload middleware to accept files of given types
 */


export const uploadMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const uploads: Promise<void>[] = [];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const uploadedFiles: any[] = [];

  let uploadError: Error | null = null;

  const allowedMimeTypes = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]);

  const bb = busboy({
    headers: req.headers,
  });

  bb.on('file', (_fieldname, file, info) => {
    const { filename, mimeType } = info;

    if (!allowedMimeTypes.has(mimeType)) {
      uploadError = new AppError('Unsupported file type.', 400);
      file.resume();

      return;
    }

    uploads.push(
      serviceStorage.storageService
        .upload(
          getobjectName(Number(req.user?.id), filename, mimeType),
          file, // Readable stream
          mimeType,
          filename, // Original filename
        )
        .then((result) => {
          uploadedFiles.push(result);
        }),
    );
  });

  bb.on('error', next);

  bb.on('finish', async () => {
    if (uploadError) {
      return next(uploadError);
    }

    try {
      await Promise.all(uploads);

      req.uploadedFiles = uploadedFiles;

      next();
    } catch (err) {
      logger.logError({
        module: FILE_CONSTANTS.MESSAGES.MODULE.MIDDLEWARE_UPLOADER,
        action: FILE_CONSTANTS.MESSAGES.ACTION.MIDDLEWARE_UPLOADER,
        message: FILE_CONSTANTS.MESSAGES.FILE.MIDDLEWARE_UPLOAD_ERROR,
      });
      next(err);
    }
  });

  req.pipe(bb);
};

const getobjectName = (userId: number, filename: string, mimeType: string) => {
  const extension = path.extname(filename);

  let folder = 'others';

  if (mimeType.startsWith('image/')) {
    folder = 'images';
  } else if (mimeType.startsWith('video/')) {
    folder = 'videos';
  } else if (mimeType.startsWith('application/') || mimeType.startsWith('text/')) {
    folder = 'documents';
  }

  console.log('userID',userId);

  const objectName = objectNameDirectory.generateImageAndDocument(userId, folder, extension);

  return objectName;
};
