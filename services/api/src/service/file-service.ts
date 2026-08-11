
import serviceStorage from '@dam/shared/storage';

import sequelize from '@dam/database'
import config from '../config/index.js';
import rabbitmq from '@dam/shared/rabbitmq';
import FILE_CONSTANTS from '@dam/shared/constants'
import logger from '../logger/index.js';
import { AppError } from '../middleware/app-error.js';
import model from '@dam/database/models';
import objectNameDirectory from '../object/dam-object.js';
import repository from '@dam/database/repositories';
import utils from '../utils/index.js';

import type {
  ICompleteUploadRequestDto,
  IDeleteFileRequestDto,
  IDownloadFileRequestDto,
  IDownloadRequestDto,
  IGetFileCountRequestDto,

  IGetFilesRequestDto,
  IGetFileStatusRequestDto,
  IInitUploadRequestDto,
  IUploadFileRequestDto,
  IUploadPartRequestDto,
} from '../dto/request/file-request-dto.js';
import type {
  ICompleteUploadResponseDto,
  IDeleteFileResponseDto,
  IDownloadedResponseDto,
  IGetFileCountResponseDto,
  IGetFilesResponseDto,
  IGetFileStatusResponseDto,
  IInitUploadResponseDto,
  IUploadFileResponseDto,
  IUploadPartResponseDto,
} from '../dto/response/file-response-dto.js';

import type { Transaction } from 'sequelize';
import shared from '@dam/shared';

/**
 *
 * @param request - Upload file request data.
 * @returns Details of the uploaded files.
 * @throws {AppError} If no files are provided.
 */

export const uploadFilesService = async (
  request: IUploadFileRequestDto,
): Promise<IUploadFileResponseDto> => {
  utils.idValidators.validateUserId(request.userId);

  if (!request.uploadedFiles.length) {
    logger.logError({
      module: FILE_CONSTANTS.MESSAGES.MODULE.FILE_SERVICE_ERROR,
      action: FILE_CONSTANTS.MESSAGES.ACTION.SERVICE_FILE_ERROR,
      message: FILE_CONSTANTS.MESSAGES.FILE.NO_FILES_UPLOADED,
    });

    throw new AppError(
      FILE_CONSTANTS.MESSAGES.FILE.NO_FILES_UPLOADED,
      FILE_CONSTANTS.HTTP_STATUS.BAD_REQUEST,
    );
  }

  const files = request.uploadedFiles.map((file) => ({
    user_id: request.userId,
    name: file.originalName,
    file_name: file.originalName,
    size: file.size,
    mime_type: file.mimeType,
    path: file.objectName,
    thumbnail_image: '',
    type: file.mimeType.startsWith('image/') ? 'image' : 'document',
    status: file.mimeType.startsWith('image/')
      ? FILE_CONSTANTS.MESSAGES.FILE_STATUS.PENDING
      : FILE_CONSTANTS.MESSAGES.FILE_STATUS.COMPLETED,
  }));

  const createdFiles = await repository.fileRepository.bulkCreate(files);

  for (const file of createdFiles) {
    if (file.mime_type.startsWith('image/')) {
      shared.rabbitmq.rabbitmqService.publishMessage(shared.rabbitmq.rabbitMQQueues.image, {
        fileId: file.id,
        userId: request.userId,
        objectName: file.path,
        mimeType: file.mime_type,
      });
    }
  }



  const response: IUploadFileResponseDto = {
    message: FILE_CONSTANTS.MESSAGES.FILE.UPLOAD_SUCCESS,
    result: createdFiles,
  };

  logger.fileLogger.uploaded(request.userId);

  return response;
};

/**
 * @param request - User file retrieval request.
 * @returns List of files owned by the user.
 * @throws {AppError} If the user does not exist.
 */

export const getFilesService = async (
  request: IGetFilesRequestDto,
): Promise<IGetFilesResponseDto> => {
  const { rows: files, count } = await repository.fileRepository.findAllByType(
    request.userId,
    request.type,
    request.page,
    request.limit,
  );

  const totalPages = Math.ceil(count / request.limit);

  const response: IGetFilesResponseDto = {
    message: FILE_CONSTANTS.MESSAGES.FILE.FETCH_SUCCESS,
    result: files,
    pagination: {
      page: request.page,
      limit: request.limit,
      total: count,
      totalPages,
      hasNextPage: request.page < totalPages,
      hasPreviousPage: request.page > 1,
    },
  };

  logger.fileLogger.fetched(request.userId, count);

  return response;
};

/**
 * @param request - User file retrieval request.
 * @returns List of files owned by the user.
* @throws {AppError} If the user does not exist.
 */

export const getFilesCount = async (
  request: IGetFileCountRequestDto,
): Promise<IGetFileCountResponseDto> => {

  const filesCount = await repository.fileRepository.getFileCounts(request.userId);

  const response: IGetFileCountResponseDto = {
    message: FILE_CONSTANTS.MESSAGES.FILE.FETCH_SUCCESS_COUNT,
    result: {
      images: filesCount.images,
      videos: filesCount.videos,
      document: filesCount.others,
    },
  };

  logger.fileLogger.fetchedFileCount(request.userId);

  return response;
};

/**
 *
 * @param userId - Owner of the file.
 * @param fileId - Identifier of the file to delete.
 * @returns Success response after deletion.
 * @throws {AppError} If the file is not found.
 */

export const deleteFileService = async(
  request: IDeleteFileRequestDto,
): Promise<IDeleteFileResponseDto>  => {

  
  utils.idValidators.validateFileId(request.fileId);

  const fileData = await repository.fileRepository.findFileByPrimaryKey(request.fileId);

  if (!fileData) {
    logger.logError({
      module: FILE_CONSTANTS.MESSAGES.MODULE.FILE_SERVICE_ERROR,
      action: FILE_CONSTANTS.MESSAGES.ACTION.SERVICE_FILE_ERROR,
      message: FILE_CONSTANTS.MESSAGES.FILE.FILE_ID_NOT_FOUND,
    });

    throw new AppError(
      FILE_CONSTANTS.MESSAGES.FILE.FILE_ID_NOT_FOUND,
      FILE_CONSTANTS.HTTP_STATUS.BAD_REQUEST,
    );
  }

  await serviceStorage.storageService.deleteObject(fileData.path);

  await fileData.destroy();

  logger.fileLogger.deleted(request.fileId);

  const response: IDeleteFileResponseDto = {
    message: FILE_CONSTANTS.MESSAGES.FILE.DELETE_SUCCESS,
  };

  return response;
};



/**
 *
 * @param userId - Owner of the file.
 * @param fileId - Identifier of the file to delete.
 * @returns Success response of status.
 * @throws {AppError} If the file is not found.
 */

export const getFileStatus = async (request: IGetFileStatusRequestDto) => {
  utils.idValidators.validateFileId(request.fileId);

  const fileData = await model.File.findOne({
    where: {
      id: request.fileId,
      user_id: request.userId,
    },
  });

  if (!fileData) {
    logger.logError({
      module: FILE_CONSTANTS.MESSAGES.MODULE.FILE_SERVICE_ERROR,
      action: FILE_CONSTANTS.MESSAGES.ACTION.SERVICE_FILE_ERROR,
      message: FILE_CONSTANTS.MESSAGES.FILE.FILE_ID_NOT_FOUND,
    });

    throw new AppError(
      FILE_CONSTANTS.MESSAGES.FILE.FILE_ID_NOT_FOUND,
      FILE_CONSTANTS.HTTP_STATUS.BAD_REQUEST,
    );
  }



  const response: IGetFileStatusResponseDto = {
    message: FILE_CONSTANTS.MESSAGES.FILE.FETCH_SUCCESS,
    status: fileData.status
  };

  return response;
};

/**
 *
 * @param request - Multipart upload initialization request.
 * @returns Upload initialization details including file ID,
 * processing ID, and object path.
 * @throws {AppError} If the file type is invalid or upload initialization fails.
 */

export const initUpload = async (
  request: IInitUploadRequestDto,
): Promise<IInitUploadResponseDto> => {
  if (!request.mimeType.startsWith('video/')) {
    logger.logError({
      module: FILE_CONSTANTS.MESSAGES.MODULE.FILE_SERVICE_ERROR,
      action: FILE_CONSTANTS.MESSAGES.ACTION.SERVICE_FILE_ERROR,
      message: FILE_CONSTANTS.MESSAGES.FILE.INVALID_FILE_TYPE,
    });

    throw new AppError(
      FILE_CONSTANTS.MESSAGES.FILE.INVALID_FILE_TYPE,
      FILE_CONSTANTS.HTTP_STATUS.BAD_REQUEST,
    );
  }


  try {
    const payload = {
      user_id: request.userId,
      name: request.fileName,
      file_name: request.fileName,
      size: 0,
      mime_type: request.mimeType,
      path: '',
      type: 'video',
      status: FILE_CONSTANTS.MESSAGES.FILE_STATUS.PENDING,
    };

    const file = await repository.fileRepository.createFile(payload);

    // Step 2: Generate object path
    const objectName = objectNameDirectory.generateVIdeo(request.userId, file.id, request.fileName);

    // Step 3: Create multipart upload in MinIO
    return updateDbforInitUpload(request, objectName, file.id);
  } catch (err) {
    console.log(err);


    logger.logError({
      module: FILE_CONSTANTS.MESSAGES.MODULE.FILE_SERVICE_ERROR,
      action: FILE_CONSTANTS.MESSAGES.ACTION.SERVICE_FILE_ERROR,
      message: FILE_CONSTANTS.MESSAGES.FILE.ERROR_S3,
    });

    throw new AppError(
      FILE_CONSTANTS.MESSAGES.FILE.ERROR_S3,
      FILE_CONSTANTS.HTTP_STATUS.BAD_REQUEST,
    );
  }
};

/**
 *
 * @param request
 * @param transaction
 * @param objectName
 * @param id
 * @returns success after successfully initializing the file
 * @throws {AppError} If the file type is invalid or upload initialization fails.
 */

const updateDbforInitUpload = async (
  request: IInitUploadRequestDto,
  objectName: string,
  id: number,
): Promise<IInitUploadResponseDto> => {

  const command = await serviceStorage.s3Service.initMultipartUpload(
    ({
      bucket: process.env.MINIO_BUCKET!,
      key: objectName,
      contentType: request.mimeType,
    }),
  );

  if (!command) {
    throw new AppError(
      FILE_CONSTANTS.MESSAGES.FILE.INVALID_FILE,
      FILE_CONSTANTS.HTTP_STATUS.BAD_REQUEST,
    );
  }

  await repository.fileRepository.updateFilePath(id, objectName);

  const payload = {
    file_id: id,
    upload_id: command,
    status: 'INITIATED',
    path: objectName,
  };

  const fileProcessing = await repository.fileRepository.createFIleProcessing(payload);


  const response: IInitUploadResponseDto = {
    message: FILE_CONSTANTS.MESSAGES.FILE.FILE_UPLOAD_INITIATE_SUCCESS,
    result: {
      fileId: id,
      processingId: fileProcessing.id,
      objectName,
    },
  };

  logger.fileLogger.initUpload(request.userId, id);

  return response;
};

/**
 * @param request - Multipart upload part request.
 * @returns Uploaded part number and ETag.
 * @throws {AppError} If the multipart upload session is invalid.
 */

export const uploadPart = async (
  request: IUploadPartRequestDto,
): Promise<IUploadPartResponseDto> => {
  const fileProcessing = await repository.fileRepository.findUploadId(request.processingId);

  if (!fileProcessing) {
    throw new AppError(
      FILE_CONSTANTS.MESSAGES.FILE.UPLOAD_ID_ERROR,
      FILE_CONSTANTS.HTTP_STATUS.BAD_REQUEST,
    );
  }

  const command = await serviceStorage.s3Service.uploadPart(
   {
      bucket: process.env.MINIO_BUCKET!,
      key: fileProcessing.path,
      uploadId: fileProcessing.upload_id,
      partNumber: request.partNumber,
      body: request.buffer!,
    },
  );

  if (!command) {
    throw new Error('Failed to upload file part.');
  }

  await repository.fileRepository.updateFileProcessingStatus(
    request.processingId,
    FILE_CONSTANTS.MESSAGES.FILE_STATUS.PENDING,
  );

  const response: IUploadPartResponseDto = {
    partNumber: request.partNumber,
    etag: command,
  };

  return response;
};

/** *
 * @param userId - check's the ownership of files
 * @param id - file processing id to fetch upload id.
 * @param parts - buffer part number
 * @returns stores the file in minIO and returns the success response.
 * @throws {AppError} If upload completion fails.
 */

export const completeUpload = async (
  request: ICompleteUploadRequestDto,
): Promise<ICompleteUploadResponseDto> => {
  const fileProcessing = await model.FileProcessing.findByPk(request.processingId);

  if (!fileProcessing) {
    logger.logError({
      module: FILE_CONSTANTS.MESSAGES.MODULE.FILE_SERVICE_ERROR,
      action: FILE_CONSTANTS.MESSAGES.ACTION.SERVICE_FILE_ERROR,
      message: FILE_CONSTANTS.MESSAGES.FILE.FILE_NOT_FOUND,
    });

    throw new AppError(
      FILE_CONSTANTS.MESSAGES.FILE.FILE_NOT_FOUND,
       FILE_CONSTANTS.HTTP_STATUS.BAD_REQUEST,
    );
  }

  await serviceStorage.s3Service.completeMultipartUpload(
   {
      bucket: process.env.MINIO_BUCKET!,
      key: fileProcessing.path,
      uploadId: fileProcessing.upload_id,
        parts: request.parts.map((part) => ({
          PartNumber: part.partNumber,
          ETag: part.etag,
        })),
      
    },
  );

  return updateDbforCompleteUpload(request, fileProcessing.path);
};

/**
 *
 * @param request
 * @param fileId
 * @param path
 * @returns Succes after db updated after completing part upload
 */

const updateDbforCompleteUpload = async (request: ICompleteUploadRequestDto, path: string) => {

  await repository.fileRepository.updateFileProcessingStatus(
    request.processingId,
    FILE_CONSTANTS.MESSAGES.FILE_STATUS.COMPLETED,
  );
  await repository.fileRepository.updateFileStatus(
    request.fileId,
    FILE_CONSTANTS.MESSAGES.FILE_STATUS.PENDING,
  );

  // Publish thumbnail generation job

  shared.rabbitmq.rabbitmqService.publishMessage(shared.rabbitmq.rabbitMQQueues.video, {
    type: 'thumbnail',
    fileId: request.fileId,
    userId: request.userId,
    objectName: path,
  });

  const response: ICompleteUploadResponseDto = {
    message: FILE_CONSTANTS.MESSAGES.FILE.COMPLETE_UPLOAD_SUCCESS,
    status: FILE_CONSTANTS.MESSAGES.FILE_STATUS.PENDING,
  };

  logger.fileLogger.completePartUpload(request.userId, request.fileId);

  return response;
};

/**
 *
 * @param request accepts fileId for downloading the video
 * @returns downloaded url for video
 */

export const downloadVideo = async (request: IDownloadRequestDto) => {
  const file = await repository.fileRepository.findFileByPrimaryKey(request.fileId);

  if (!file) {
    logger.logError({
      module: FILE_CONSTANTS.MESSAGES.MODULE.FILE_SERVICE_ERROR,
      action: FILE_CONSTANTS.MESSAGES.ACTION.SERVICE_FILE_ERROR,
      message: FILE_CONSTANTS.MESSAGES.FILE.FILE_NOT_FOUND,
    });

    throw new AppError(
      FILE_CONSTANTS.MESSAGES.FILE.FILE_NOT_FOUND,
       FILE_CONSTANTS.HTTP_STATUS.BAD_REQUEST,
    );
  }

  return await updateDbforDownloadVideo(request, file.path);
};


/**
 *
 * @param request accepts fileId for downloading the video
 * @returns downloaded url for files
 */

export const downloadFiles = async (request: IDownloadFileRequestDto): Promise<IDownloadedResponseDto> => {
  const file = await repository.fileRepository.findFileByPrimaryKey(request.fileId);




  if (!file) {
    logger.logError({
      module: FILE_CONSTANTS.MESSAGES.MODULE.FILE_SERVICE_ERROR,
      action: FILE_CONSTANTS.MESSAGES.ACTION.SERVICE_FILE_ERROR,
      message: FILE_CONSTANTS.MESSAGES.FILE.FILE_NOT_FOUND,
    });

    throw new AppError(
      FILE_CONSTANTS.MESSAGES.FILE.FILE_NOT_FOUND,
       FILE_CONSTANTS.HTTP_STATUS.BAD_REQUEST,
    );
  }

  const url = await serviceStorage.storageService.getObjectUrl(file.path, file.name);

  if (!url) {
    logger.logError({
      module: FILE_CONSTANTS.MESSAGES.MODULE.FILE_SERVICE_ERROR,
      action: FILE_CONSTANTS.MESSAGES.ACTION.SERVICE_FILE_ERROR,
      message: FILE_CONSTANTS.MESSAGES.FILE.FILE_NOT_FOUND,
    });

    throw new AppError(
      FILE_CONSTANTS.MESSAGES.FILE.FILE_NOT_FOUND,
       FILE_CONSTANTS.HTTP_STATUS.BAD_REQUEST,
    );
  }
  
  const response: IDownloadedResponseDto = {
    message: FILE_CONSTANTS.MESSAGES.FILE.DOWNLOAD_FILE_SUCCESS,
    status: FILE_CONSTANTS.MESSAGES.FILE_STATUS.COMPLETED,
    url: url,
  };

    return response;
};

/**
 *
 * @param request  accept fileId for updating the records
 * @param pathName  accepts pathname to fetch data from minIO
 * @returns downloaded file url if ready
 */

const updateDbforDownloadVideo = async (request: IDownloadRequestDto, pathName: string) => {
  const qualityRow = await repository.videoQualityRepository.findVideoQuality(request.fileId);



  let objectName: string | null = null;

  if (qualityRow) {
    switch (request.quality) {
      case '360p':
        objectName = qualityRow.low_quality_path;
        break;

      case '480p':
        objectName = qualityRow.medium_quality_path;
        break;

      case '720p':
        objectName = qualityRow.high_quality_path;
        break;

      case '1080p':
        objectName = qualityRow.hd_quality_path;
        break;
    }
  }

  if (objectName) {
    const url = await serviceStorage.storageService.getObjectUrl(objectName, request.quality);
    const response: IDownloadedResponseDto = {
      message: FILE_CONSTANTS.MESSAGES.FILE.DOWNLOAD_FILE_SUCCESS,
      status: FILE_CONSTANTS.MESSAGES.FILE_STATUS.COMPLETED,
      url: url,
    };

    return response;
  }

  // Publish RabbitMQ job
  shared.rabbitmq.rabbitmqService.publishMessage(shared.rabbitmq.rabbitMQQueues.video, {
    type: 'quality',
    fileId: request.fileId,
    userId: request.userId,
    objectName: pathName,
    quality: request.quality,
  });

  await repository.fileRepository.updateFileStatus(
    request.fileId,
    FILE_CONSTANTS.MESSAGES.FILE_STATUS.PENDING,
  );

  const response: IDownloadedResponseDto = {
    message: FILE_CONSTANTS.MESSAGES.FILE.DOWNLOAD_FILE_SUCCESS,
    status: FILE_CONSTANTS.MESSAGES.FILE_STATUS.PENDING,
    url: '',
  };

  return response;
};
