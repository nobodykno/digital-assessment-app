import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import { unlink } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import logs from '@dam/shared/logs';
import repository from '@dam/database/repositories';
import { IVideoQualityCreateAttributes } from '../../../../packages/database/dist/types/video-quality-type.js';
import { IVideoProcessingJob } from '../dto/video-processing-dto.js';
import logger from '../logger/index.js';
import shared from '@dam/shared';
import serviceStorage from '@dam/shared/storage';
import logsWorker from '../logger/index.js';

const RESOLUTIONS = {
  '360p': '640:360',
  '480p': '854:480',
  '720p': '1280:720',
  '1080p': '1920:1080',
} as const;

type VideoQuality = keyof typeof RESOLUTIONS;

/**
 * Generates the requested video quality,
 * uploads it to MinIO, updates the database,
 * and removes temporary files.
 */
const generateVideoQuality = async (
  data: IVideoProcessingJob,
): Promise<void> => {
  let tempVideoPath: string | undefined;
  let tempOutputPath: string | undefined;

  try {
    if (!data.quality) {
      logs.logError({
        module: shared.FILE_CONSTANTS.MESSAGES.MODULE.VIDEO_WORKER,
        action: shared.FILE_CONSTANTS.MESSAGES.ACTION.GENERATE_VIDEO_QUALITY,
        message: shared.FILE_CONSTANTS.MESSAGES.WORKER.VIDEO_QUALITY_MISSING,
      });

      throw Error(
        shared.FILE_CONSTANTS.MESSAGES.WORKER.VIDEO_QUALITY_MISSING,
      );
    }

    tempVideoPath = await downloadVideo(data.objectName);

    logger.workerLogger.generateVideoQuality(
      `Generating ${data.quality} quality for file ${data.fileId}`,
    );

    tempOutputPath = await transcodeVideo(
      tempVideoPath,
      data.quality as VideoQuality,
    );
    
    const objectName =`users/${data.userId}/videos/${data.fileId}/${data.quality}/${crypto.randomUUID()}-${path.basename(
        tempOutputPath,
      )}`;
 

    /**
     * IMPORTANT:
     * Wait for upload + DB update to finish before
     * deleting tempOutputPath in finally.
     */
    await uploadMinIOUpdateDB(data, objectName, tempOutputPath);

    logger.workerLogger.generateVideoQuality(objectName);
  } catch (error) {
    logs.logError({
      module: shared.FILE_CONSTANTS.MESSAGES.MODULE.VIDEO_WORKER,
      action: shared.FILE_CONSTANTS.MESSAGES.ACTION.GENERATE_VIDEO_QUALITY,
      message: shared.FILE_CONSTANTS.MESSAGES.WORKER.GENERATE_VIDEO_QUALITY_FAIL,
    });

    throw error;
  } finally {
    if (tempVideoPath) {
      await removeTempFile(tempVideoPath);
    }

    if (tempOutputPath) {
      await removeTempFile(tempOutputPath);
    }
  }
};

/**
 * Upload generated video to MinIO and update database.
 */
const uploadMinIOUpdateDB = async (
  data: IVideoProcessingJob,
  objectName: string,
  tempOutputPath: string,
): Promise<void> => {
  await serviceStorage.storageService.upload(
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

    default:
      throw Error(
        shared.FILE_CONSTANTS.MESSAGES.WORKER.VIDEO_QUALITY_MISSING,
      );
  }

  const [updatedRows] =
    await repository.videoQualityRepository.updateVideoQuality(
      updateData,
      data.fileId,
    );

  /**
   * If no existing video quality record exists,
   * create one.
   */
  if (!updatedRows) {
    const videoQuality: IVideoQualityCreateAttributes = {
      file_id: data.fileId,
      hd_quality_path:
        data.quality === '1080p' ? objectName : '',
      high_quality_path:
        data.quality === '720p' ? objectName : '',
      medium_quality_path:
        data.quality === '480p' ? objectName : '',
      low_quality_path:
        data.quality === '360p' ? objectName : '',
    };

    await repository.videoQualityRepository.createVideoQuality(
      videoQuality,
    );
  }

  await repository.fileRepository.updateFileStatus(
    data.fileId,
    shared.FILE_CONSTANTS.MESSAGES.FILE_STATUS.COMPLETED,
  );
};

/**
 * Downloads the original video from MinIO
 * to a temporary local file.
 */
const downloadVideo = async (
  objectName: string,
): Promise<string> => {
  const stream = await serviceStorage.storageService.getObject(objectName);

  const tempVideoPath = path.join(
    os.tmpdir(),
    `${crypto.randomUUID()}.mp4`,
  );

  await pipeline(
    stream,
    fs.createWriteStream(tempVideoPath),
  );

  return tempVideoPath;
};

/**
 * Generates the requested video quality using FFmpeg.
 */
const transcodeVideo = async (
    inputVideo: string,
    quality: VideoQuality,
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const outputPath = path.join(
        os.tmpdir(),
        `${crypto.randomUUID()}-${quality}.mp4`,
      );
  
      const ffmpeg = spawn('ffmpeg', [
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
  
        '-y',
  
        outputPath,
      ]);
  
      ffmpeg.stderr.on('data', (data: Buffer) => {
         console.log(data);
      });
  
      ffmpeg.on('close', (code) => {
        if (code === 0) {
          logger.workerLogger.generateVideoQuality(
            `${quality} generated: ${outputPath}`,
          );
  
          resolve(outputPath);
        } else {
          reject(
            new Error(`FFmpeg exited with code ${code}`),
          );
        }
      });
  
      ffmpeg.on('error', (error) => {
        reject(error);
      });
    });
  };

/**
 * Removes a temporary file safely.
 */
const removeTempFile = async (
  filePath: string,
): Promise<void> => {
  try {
    await unlink(filePath);

    logsWorker.workerLogger.removeTempFIles(
      filePath,
      shared.FILE_CONSTANTS.MESSAGES.MODULE.VIDEO_WORKER,
      shared.FILE_CONSTANTS.MESSAGES.WORKER.REMOVED_TEMP_FILE_SUCCESS,
    );
  } catch {
    logs.logError({
      module: shared.FILE_CONSTANTS.MESSAGES.MODULE.VIDEO_WORKER,
      action: shared.FILE_CONSTANTS.MESSAGES.ACTION.GENERATE_VIDEO_QUALITY,
      message:
      shared.FILE_CONSTANTS.MESSAGES.WORKER.REMOVED_TEMP_FILE_FAIL,
    });
  }
};

const videoQualityService = {
  generateVideoQuality,
};

export default videoQualityService;