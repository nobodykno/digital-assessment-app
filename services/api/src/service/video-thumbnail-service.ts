import { spawn } from 'child_process';
import crypto from 'crypto';
import fs from 'fs';
import { unlink } from 'fs/promises';
import os from 'os';
import path from 'path';
import { pipeline } from 'stream/promises';

import ffmpegPath from 'ffmpeg-static';

import FILE_CONSTANTS from '@dam/shared/constants'
import logger from '../logger/index.js';
import objectNameDirectory from '../object/dam-object.js';
import repository from '../repository/index.js';

import storageService from './storage-service.js';

import type { IWorkerDTOJob } from '../dto/worker/thumbnail-worker-dto.js';

const generateThumbnail = async (data: IWorkerDTOJob): Promise<string> => {
  let tempVideoPath: string | undefined;
  let tempThumbnailPath: string | undefined;

  try {
    tempVideoPath = await downloadVideo(data.objectName);

    tempThumbnailPath = await createThumbnail(tempVideoPath);

    const objectName = objectNameDirectory.generateVideoThumbnail(
      data.userId,
      data.fileId,
      tempThumbnailPath,
    );

    const stream = fs.createReadStream(tempThumbnailPath);

    await storageService.upload(objectName, stream, 'image/jpeg');

    await repository.fileRepository.updateFileThumbnailImage(data.fileId, objectName);

    logger.workerLogger.generateVideoThumbnail(objectName);

    return tempThumbnailPath;
  } catch (error) {
    logger.logError({
      module: FILE_CONSTANTS.MESSAGES.MODULE.VIDEO_WORKER,
      action: FILE_CONSTANTS.MESSAGES.ACTION.GENERATE_VIDEO_THUMBNAIL,
      message: FILE_CONSTANTS.MESSAGES.WORKER.GENERATE_THUMBNAIL_VIDEO_SUCCESS,
    });

    throw error;
  } finally {
    // Always delete temporary files

    if (tempVideoPath) {
      try {
        await unlink(tempVideoPath);

        logger.workerLogger.removeTempFIles(
          tempVideoPath,
          FILE_CONSTANTS.MESSAGES.MODULE.VIDEO_WORKER,
          FILE_CONSTANTS.MESSAGES.WORKER.REMOVED_TEMP_FILE_SUCCESS,
        );
      } catch {
        logger.logError({
          module: FILE_CONSTANTS.MESSAGES.MODULE.VIDEO_WORKER,
          action: FILE_CONSTANTS.MESSAGES.ACTION.GENERATE_VIDEO_THUMBNAIL,
          message: FILE_CONSTANTS.MESSAGES.WORKER.REMOVED_TEMP_FILE_FAIL,
        });
      }
    }

    if (tempThumbnailPath) {
      try {
        await unlink(tempThumbnailPath);
        logger.workerLogger.removeTempFIles(
          tempThumbnailPath,
          FILE_CONSTANTS.MESSAGES.MODULE.VIDEO_WORKER,
          FILE_CONSTANTS.MESSAGES.WORKER.REMOVED_TEMP_FILE_SUCCESS,
        );
      } catch {
        logger.logError({
          module: FILE_CONSTANTS.MESSAGES.MODULE.VIDEO_WORKER,
          action: FILE_CONSTANTS.MESSAGES.ACTION.GENERATE_VIDEO_THUMBNAIL,
          message: FILE_CONSTANTS.MESSAGES.WORKER.REMOVED_TEMP_FILE_FAIL,
        });
      }
    }
  }
};


export const createThumbnail = async (videoPath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const thumbnailPath = path.join(os.tmpdir(), `${crypto.randomUUID()}.jpg`);

    if (!ffmpegPath) {
      throw new Error('FFmpeg binary not found');
    }

    const ffmpeg = spawn(ffmpegPath, [
      '-i',
      videoPath,

      // Capture frame at 3 seconds
      '-ss',
      '00:00:03',

      '-frames:v',
      '1',

      '-q:v',
      '2',

      thumbnailPath,
    ]);

    ffmpeg.stderr.on('data', (data) => {
      console.log(data.toString());
    });

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Thumbnail created:', thumbnailPath);
        resolve(thumbnailPath);
      } else {
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });

    ffmpeg.on('error', reject);
  });
};

export const downloadVideo = async (objectName: string): Promise<string> => {
  const stream = await storageService.getObject(objectName);

  const tempVideoPath = path.join(os.tmpdir(), `${crypto.randomUUID()}.mp4`);

  await pipeline(stream, fs.createWriteStream(tempVideoPath));

  return tempVideoPath;
};

const videoThumbnailService = {
  generateThumbnail,
};

export default videoThumbnailService;
