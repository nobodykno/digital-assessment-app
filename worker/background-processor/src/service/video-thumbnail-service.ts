import { spawn } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import { unlink } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { IWorkerDTOJob } from '../dto/worker-dto.js';
import serviceStorage from '@dam/shared/storage';
import repository from '@dam/database/repositories';
import logsWorker from "../logger/index.js";
import logs from "@dam/shared/logs";
import shared from "@dam/shared";





const generateThumbnail = async (data: IWorkerDTOJob): Promise<string> => {
  let tempVideoPath: string | undefined;
  let tempThumbnailPath: string | undefined;

  try {
    tempVideoPath = await downloadVideo(data.objectName);

    tempThumbnailPath = await createThumbnail(tempVideoPath);

    const objectName = `users/${data.userId}/images/${data.fileId}/thumbnails/video/${crypto.randomUUID()}-${path.basename(tempThumbnailPath)}`
    
    const stream = fs.createReadStream(tempThumbnailPath);

    await serviceStorage.storageService.upload(objectName, stream, 'image/jpeg');

    await repository.fileRepository.updateFileThumbnailImage(data.fileId, objectName);

    logsWorker.workerLogger.generateVideoThumbnail(objectName);

    return tempThumbnailPath;
  } catch (error) {

    console.log("error",error)
    logs.logError({
      module: shared.FILE_CONSTANTS.MESSAGES.MODULE.VIDEO_WORKER,
      action: shared.FILE_CONSTANTS.MESSAGES.ACTION.GENERATE_VIDEO_THUMBNAIL,
      message: shared.FILE_CONSTANTS.MESSAGES.WORKER.GENERATE_THUMBNAIL_VIDEO_SUCCESS,
    });

    throw error;
  } finally {
    // Always delete temporary files

    if (tempVideoPath) {
      try {
        await unlink(tempVideoPath);
        logsWorker.workerLogger.removeTempFIles(
          tempVideoPath,
          shared.FILE_CONSTANTS.MESSAGES.MODULE.VIDEO_WORKER,
          shared.FILE_CONSTANTS.MESSAGES.WORKER.REMOVED_TEMP_FILE_SUCCESS,
        );

      } catch(error) {
        console.log("unlink error",error)
        logs.logError({
          module: shared.FILE_CONSTANTS.MESSAGES.MODULE.VIDEO_WORKER,
          action: shared.FILE_CONSTANTS.MESSAGES.ACTION.GENERATE_VIDEO_THUMBNAIL,
          message: shared.FILE_CONSTANTS.MESSAGES.WORKER.REMOVED_TEMP_FILE_FAIL,
        });
      }
    }

    if (tempThumbnailPath) {
      try {
        await unlink(tempThumbnailPath);
        logsWorker.workerLogger.removeTempFIles(
          tempThumbnailPath,
          shared.FILE_CONSTANTS.MESSAGES.MODULE.VIDEO_WORKER,
          shared.FILE_CONSTANTS.MESSAGES.WORKER.REMOVED_TEMP_FILE_SUCCESS,
        );
      } catch {
        logs.logError({
          module: shared.FILE_CONSTANTS.MESSAGES.MODULE.VIDEO_WORKER,
          action: shared.FILE_CONSTANTS.MESSAGES.ACTION.GENERATE_VIDEO_THUMBNAIL,
          message: shared.FILE_CONSTANTS.MESSAGES.WORKER.REMOVED_TEMP_FILE_FAIL,
        });
      }
    }
  }
};

export const createThumbnail = async (
    videoPath: string,
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const thumbnailPath = path.join(
        os.tmpdir(),
        `${crypto.randomUUID()}.jpg`,
      );
  
      const ffmpeg = spawn("ffmpeg", [
        "-y",
        "-ss",
        "00:00:03",
        "-i",
        videoPath,
        "-frames:v",
        "1",
        "-vf",
        "scale=300:-1",
        "-q:v",
        "2",
        "-update",
        "1",
        thumbnailPath,
      ]);
  
      ffmpeg.stderr.on(
        "data",
        (data: Buffer) => {
          console.log(
            `[FFmpeg] ${data.toString()}`,
          );
        },
      );
  
      ffmpeg.on("error", (error) => {
        reject(error);
      });
  
      ffmpeg.on("close", (code) => {
        if (code === 0) {
          console.log(
            "✅ Thumbnail created:",
            thumbnailPath,
          );
      
          resolve(thumbnailPath);
        } else {
          reject(
            new Error(
              `FFmpeg exited with code ${code}`,
            ),
          );
        }
      });
    });
  };

export const downloadVideo = async (objectName: string): Promise<string> => {
  const stream = await serviceStorage.storageService.getObject(objectName);

  const tempVideoPath = path.join(os.tmpdir(), `${crypto.randomUUID()}.mp4`);

  await pipeline(stream, fs.createWriteStream(tempVideoPath));

  return tempVideoPath;
};

const videoThumbnailService = {
  generateThumbnail,
};

export default videoThumbnailService;
