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
import { AppError } from '../middleware/app-error.js';
import objectNameDirectory from '../object/dam-object.js';
import repository from '../repository/index.js';

import storageService from './storage-service.js';

import type { IVideoProcessingJob } from '../dto/worker/video-worker-dto.js';
import type { IVideoQualityCreateAttributes } from '../types/video-quality-type.js';

const RESOLUTIONS = {
  '360p': '640:360',
  '480p': '854:480',
  '720p': '1280:720',
  '1080p': '1920:1080',
} as const;

/**
 * Generates the requested video quality, uploads it to MinIO,
 * stores the path in the database and removes temporary files.
 */
const generateVideoQuality = async (data: IVideoProcessingJob): Promise<void> => {
  let tempVideoPath: string | undefined;
  let tempOutputPath: string | undefined;

  try {
    if (!data.quality) {
      logger.logError({
        module: FILE_CONSTANTS.MESSAGES.MODULE.VIDEO_WORKER,
        action: FILE_CONSTANTS.MESSAGES.ACTION.GENERATE_VIDEO_QUALITY,
        message: FILE_CONSTANTS.MESSAGES.WORKER.VIDEO_QUALITY_MISSING,
      });

      throw new AppError(
        FILE_CONSTANTS.MESSAGES.WORKER.VIDEO_QUALITY_MISSING,
        FILE_CONSTANTS.HTTP_STATUS.BAD_REQUEST,
      );
    }


    tempVideoPath = await downloadVideo(data.objectName);

    console.log('tempOutputPath');

    tempOutputPath = await transcodeVideo(tempVideoPath, data.quality);

    // Object name in MinIO
    const objectName = objectNameDirectory.generateVIdeoQuality(
      data.userId,
      data.fileId,
      data.quality,
      tempOutputPath,
    );

    // Upload generated video to MinIO

    void uploadminIOUpdateDB(data, objectName, tempOutputPath);
  } catch (error) {
    logger.logError({
      module: FILE_CONSTANTS.MESSAGES.MODULE.VIDEO_WORKER,
      action: FILE_CONSTANTS.MESSAGES.ACTION.GENERATE_VIDEO_QUALITY,
      message: FILE_CONSTANTS.MESSAGES.WORKER.GENERATE_VIDEO_QUALITY_FAIL,
    });

    throw error;
  } finally {
    // Delete original downloaded video
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
          action: FILE_CONSTANTS.MESSAGES.ACTION.GENERATE_VIDEO_QUALITY,
          message: FILE_CONSTANTS.MESSAGES.WORKER.REMOVED_TEMP_FILE_FAIL,
        });
      }
    }

    // Delete generated quality video
    if (tempOutputPath) {
      try {
        await unlink(tempOutputPath);
        logger.workerLogger.removeTempFIles(
          tempOutputPath,
          FILE_CONSTANTS.MESSAGES.MODULE.VIDEO_WORKER,
          FILE_CONSTANTS.MESSAGES.WORKER.REMOVED_TEMP_FILE_SUCCESS,
        );
      } catch {
        logger.logError({
          module: FILE_CONSTANTS.MESSAGES.MODULE.VIDEO_WORKER,
          action: FILE_CONSTANTS.MESSAGES.ACTION.GENERATE_VIDEO_QUALITY,
          message: FILE_CONSTANTS.MESSAGES.WORKER.REMOVED_TEMP_FILE_FAIL,
        });
      }
    }
  }
};

const uploadminIOUpdateDB = async (
  data: IVideoProcessingJob,
  objectName: string,
  tempOutputPath: string,
): Promise<void> => {

  await storageService.upload(
    objectName,

    fs.createReadStream(tempOutputPath),

    'video/mp4',
  );

 
  const updateData: Partial<IVideoQualityCreateAttributes> = {};

  switch (data.quality) {
    case '1080p':
      updateData.hd_quality_path = objectName;
      break;

    case '720p':
      updateData.high_quality_path = objectName;
      break;

    case '480p':
      updateData.medium_quality_path = objectName;
      break;

    case '360p':
      updateData.low_quality_path = objectName;
      break;
  }


  const [updatedRows] = await repository.videoQualityRepository.updateVideoQuality(
    updateData,
    data.fileId,
  );
  console.log('tempOutputPath');

  if (!updatedRows) {
    const videoQuality: IVideoQualityCreateAttributes = {
      file_id: data.fileId,
      hd_quality_path: data.quality === '1080p' ? objectName : '',
      high_quality_path: data.quality === '720p' ? objectName : '',
      medium_quality_path: data.quality === '480p' ? objectName : '',
      low_quality_path: data.quality === '360p' ? objectName : '',
    };

    await repository.videoQualityRepository.createVideoQuality(videoQuality);
  }

  await repository.fileRepository.updateFileStatus(
    data.fileId,
    FILE_CONSTANTS.MESSAGES.FILE_STATUS.COMPLETED,
  );


  logger.workerLogger.generateVideoQuality(objectName);
};
/**
 * Downloads the original video from MinIO.
 */
const downloadVideo = async (objectName: string): Promise<string> => {
  const stream = await storageService.getObject(objectName);

  const tempVideoPath = path.join(os.tmpdir(), `${crypto.randomUUID()}.mp4`);

  await pipeline(stream, fs.createWriteStream(tempVideoPath));

  return tempVideoPath;
};

/**
 * Generates the requested quality using FFmpeg.
 */

const transcodeVideo = async (
  inputVideo: string,
  quality: keyof typeof RESOLUTIONS,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!ffmpegPath) {
      return reject(
        new AppError(
          FILE_CONSTANTS.MESSAGES.WORKER.FFMPEG_BINARY_ERROR,
          FILE_CONSTANTS.HTTP_STATUS.BAD_REQUEST,
        ),
      );
    }

    const outputPath = path.join(os.tmpdir(), `${crypto.randomUUID()}-${quality}.mp4`);

    const ffmpeg = spawn(ffmpegPath, [
      '-i',
      inputVideo,

      '-vf',
      `scale=${RESOLUTIONS[quality]}`,

      '-c:v',
      'libx264',

      '-preset',
      'medium',

      '-crf',
      '23',

      '-c:a',
      'aac',

      '-b:a',
      '128k',

      '-movflags',
      '+faststart',

      outputPath,
    ]);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    ffmpeg.stderr.on('data', (data) => {
      // console.log(data.toString());
    });

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${quality} generated`);
        resolve(outputPath);
      } else {
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });

    ffmpeg.on('error', reject);
  });
};

const videoQualityService = {
  generateVideoQuality,
};

export default videoQualityService;
