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

  try{
    const stream = await serviceStorage.storageService.getObject(payload.objectName);
  
    const thumbnailBuffer = stream.pipe(
      sharp()
        .resize({
          width: 300,
          height: 300,
          fit: "inside",
        })
        .jpeg({
          quality: 80,
        }),
    );
  
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

  } catch(error){
    await repository.fileRepository.updateFileStatus(
      payload.fileId,
      FILE_CONSTANTS.MESSAGES.FILE_STATUS.FAILED,
    );

    throw error;
  }
  };

  const imageService = {
    processImageThumbnail
  }

  export default imageService;

function delay(arg0: number) {
  throw new Error("Function not implemented.");
}
