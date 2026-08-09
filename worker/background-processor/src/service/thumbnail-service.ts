import repository from "@dam/database/repositories";
import FILE_CONSTANTS from "@dam/shared/constants";
import serviceStorage from "@dam/shared/storage";
import logsWorker from "../logger/index.js";
import { IWorkerDTOJob } from "../dto/worker-dto.js";
import sharp from "sharp";
/**
 * Processes an image thumbnail generation job
 *
 * @param payload - Image processing job received from RabbitMQ.
 */
 const processImageThumbnail = async (payload: IWorkerDTOJob): Promise<void> => {
    const stream = await serviceStorage.storageService.getObject(payload.objectName);
  
    const chunks: Buffer[] = [];
  
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
  
    const imageBuffer = Buffer.concat(chunks);
  
    const thumbnailBuffer = await sharp(imageBuffer)
      .resize({
        width: 300,
        height: 300,
        fit: 'inside',
      })
      .jpeg({
        quality: 80,
      })
      .toBuffer();
  
    const thumbObjectName = payload.objectName.replace(
      'images/',
      `thumbnails/images/${payload.fileId}/`,
    );
  
    await serviceStorage.storageService.upload(thumbObjectName, thumbnailBuffer, 'image/jpeg');
  
    await repository.fileRepository.updateFileThumbnailImage(payload.fileId, thumbObjectName);
    await repository.fileRepository.updateFileStatus(
      payload.fileId,
      FILE_CONSTANTS.MESSAGES.FILE_STATUS.COMPLETED,
    );
  
    logsWorker.workerLogger.generateImageThumbnail(thumbObjectName);
  };

  const imageService = {
    processImageThumbnail
  }

  export default imageService;