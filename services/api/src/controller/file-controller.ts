import FILE_CONSTANTS from '@dam/shared/constants'
import { AppError } from '../middleware/app-error.js';
import service from '../service/index.js';
import sanitizeFileName from '../utils/file-utils.js';

import type {
  ICompleteUploadPartParams,
  ICompleteUploadRequestDto,
  IDeleteFileRequestDto,
  IDownloadFileParams,
  IDownloadFileRequestDto,
  IDownloadParams,
  IDownloadRequestDto,
  IFileParams,
  IFileTypeParams,
  IGetFileCountRequestDto,

  IGetFilesRequestDto,
  IGetFileStatusRequestDto,
  IInitUploadRequestDto,
  IUploadFileRequestDto,
  IUploadPartParams,
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
import type { NextFunction, Request, Response } from 'express';

/**
 * @param req - accepts the userid and uploaded files details matching to the request dto.
 * @param res - returning  response of file uploaded details matching with response dto
 * @param next - Express next middleware function.
 * @returns JSON response containing uploaded file information.
 */

export const uploadFiles = async (
  req: Request<object, IUploadFileResponseDto, IUploadPartRequestDto>,
  res: Response<IUploadFileResponseDto>,
  next: NextFunction,
) => {
  try {
    const request: IUploadFileRequestDto = {
      userId: Number(req.user?.id),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      uploadedFiles: req.uploadedFiles,
    };

    const response = await service.file.uploadFilesService(request);

    return res.status(FILE_CONSTANTS.HTTP_STATUS.CREATED).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * @param req - accepts request containing fileName and mimeType.
 * @param res -  returning response returning upload initialization details.
 * @param next - next middleware function to handle error.
 * @returns JSON response containing upload initialization information.
 */

export const initUploadFiles = async (
  req: Request<object, IInitUploadResponseDto, IInitUploadRequestDto>,
  res: Response<IInitUploadResponseDto>,
  next: NextFunction,
) => {
  try {
    const fileName = sanitizeFileName(req.body.fileName);

    const request: IInitUploadRequestDto = {
      userId: Number(req.user?.id),
      fileName: fileName,
      mimeType: req.body.mimeType,
    };

    const response = await service.file.initUpload(request);

    return res.status(FILE_CONSTANTS.HTTP_STATUS.CREATED).json(response);
  } catch (error) {
    next(error);
  }
};

/** *
 * @param req - accepts userId from the auth token from header.
 * @param res - returning response containing all files belongs to the user.
 * @param next -  next middleware function to handle error.
 * @returns JSON response containing a list of files.
 */



export const getFiles = async (
  req: Request<
    IFileTypeParams,
    IGetFilesResponseDto,
    IGetFilesRequestDto,
    { page?: string; limit?: string }
  >,
  res: Response,
  next: NextFunction,
) => {
  try {
    const request: IGetFilesRequestDto = {
      userId: Number(req.user?.id),
      type: req.params.type,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
    };

    const response = await service.file.getFilesService(request);

    return res.status(FILE_CONSTANTS.HTTP_STATUS.OK).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * @param req - accept request containing the file identifier.
 * @param res - returning  response confirming deletion.
 * @param next -  next middleware function error.
 * @returns JSON response indicating the deletion status.
 */

export const deleteFile = async (
  req: Request<IFileParams, IDeleteFileResponseDto, IDeleteFileRequestDto>,
  res: Response<IDeleteFileResponseDto>,
  next: NextFunction,
): Promise<void> => {
  try {
    const request: IDeleteFileRequestDto = {
      fileId: Number(req.params.fileId),
    };

    const response = await service.file.deleteFileService(request);

    res.status(FILE_CONSTANTS.HTTP_STATUS.OK).json(response);
    return;
  } catch (error) {
    next(error);
  }
};

/**
 * 
 * @param req accept request containing the file identifier.
 * @param res return file status as response
 * @param next middleware function error.
 * @returns JSON response indicating file status.
 */


export const getFileStatus = async (
  req: Request<IFileParams, IGetFileStatusResponseDto, IGetFileStatusRequestDto>,
  res: Response<IGetFileStatusResponseDto>,
  next: NextFunction
) => {
  try {

    const request: IGetFileStatusRequestDto = {
      fileId: Number(req.params.fileId),
      userId: Number(req.user?.id)
    };

    const response = await service.file.getFileStatus(request);



    return res.status(FILE_CONSTANTS.HTTP_STATUS.OK).json(response);
  } catch (error) {
    next(error);
  }
};




/**
 * @param req - accepts  request containing file buffer.
 * @param res - returning response containing etag and part number.
 * @param next -  next middleware function handle error.
 * @returns JSON response containing upload part information.
 */

export const uploadPart = async (
  req: Request<IUploadPartParams, IUploadPartResponseDto, object>,
  res: Response<IUploadPartResponseDto>,
  next: NextFunction,
) => {
  try {

    if (!Buffer.isBuffer(req.body)) {
      throw new AppError(FILE_CONSTANTS.MESSAGES.FILE.BUFFER_ERROR, FILE_CONSTANTS.HTTP_STATUS.BAD_REQUEST);
    }

    const request = {
      userId: Number(req.user?.id),
      fileId: Number(req.params.fileId),
      processingId: Number(req.params.processingId),
      partNumber: Number(req.params.partNumber),
      buffer: req.body,
    };

    if (typeof request.processingId !== 'number') {
      throw new Error('Invalid uploadId');
    }

    if (typeof request.partNumber !== 'number') {
      throw new Error('Invalid part number');
    }

    const result = await service.file.uploadPart(request);

    return res.status(FILE_CONSTANTS.HTTP_STATUS.OK).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @param req - accepts request containing upload ID and uploaded parts.
 * @param res - returning  response containing the completed upload details.
 * @param next - next middleware function handle error.
 * @returns JSON response confirming successful upload completion.
 */

export const completeUpload = async (
  req: Request<ICompleteUploadPartParams, ICompleteUploadResponseDto, ICompleteUploadRequestDto>,
  res: Response<ICompleteUploadResponseDto>,
  next: NextFunction,
) => {
  try {


    const request: ICompleteUploadRequestDto = {
      userId: Number(req.user?.id),
      fileId: Number(req.params.fileId),
      processingId: Number(req.params.processingId),
      parts: req.body.parts,
    };



    const result = await service.file.completeUpload(request);

    return res.status(FILE_CONSTANTS.HTTP_STATUS.OK).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * 
 * @param req accept user as identifier
 * @param res return specific type file count
 * @param next next middleware function handle error
 * @returns JSON response confirming total filecount by types.
 */

export const getFilesCount = async (
  req: Request<object, IGetFileCountResponseDto, IGetFileCountRequestDto>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const request: IGetFileCountRequestDto = {
      userId: Number(req.user?.id),
    };

    const response = await service.file.getFilesCount(request);

    return res.status(FILE_CONSTANTS.HTTP_STATUS.OK).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * 
 * @param req accept file and quality of video as identifier  
 * @param res response containing download file url
 * @returns JSON response confirming download video url.
 */

export const downloadVideo = async (
  req: Request<IDownloadParams, IDownloadedResponseDto, IDownloadRequestDto>,
  res: Response<IDownloadedResponseDto>,
) => {
  const request: IDownloadRequestDto = {
    userId: Number(req.user?.id),
    fileId: Number(req.params.fileId),
    quality: req.params.quality,
  };

  const response = await service.file.downloadVideo(request);

  if (response.status === 'Pending') {
    return res.status(201).json(response);
  }

  return res.status(200).json(response);
};

/**
 * 
 * @param req accept file  as identifier  
 * @param res response containing download file url
 * @returns JSON response confirming download video url.
 */


export const downloadFile = async (
  req: Request<IDownloadFileParams, IDownloadedResponseDto, IDownloadFileRequestDto>,
  res: Response<IDownloadedResponseDto>,
) => {
  const request: IDownloadFileRequestDto = {
    fileId: Number(req.params.fileId),
    userId: Number(req.user?.id)
  };

  const response = await service.file.downloadFiles(request);

  if (response.status === 'Pending') {
    return res.status(201).json(response);
  }

  return res.status(200).json(response);
};
