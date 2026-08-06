

/**
 * DTO for upload file request
 */
export interface IUploadFileRequestDto {
  userId: number;
  uploadedFiles: IUploadedFile[];
}

/**
 * Get file count
 */
export interface IGetFileCountRequestDto {
    userId: number;
}


/**
 * DTO for upload file
 */
export interface IUploadedFile {
  originalName: string;
  objectName: string;
  size: number;
  mimeType: string;
  etag: string;
}

/**
 * DTO for Delete file file
 */
export interface IDeleteFileRequestDto {
  fileId: number;
}
/**
 * DTO for Get file  
 */

export interface IGetFilesRequestDto {
  userId: number;
  type: string;
  page: number;
  limit: number;
}


/**
 * DTO for Get file  
 */


/**
 * DTO for init file
 */

export interface IInitUploadRequestDto {
  userId: number;
  fileName: string;
  mimeType: string;
}

/**
 * DTO for upload part
 */
export interface IUploadPartRequestDto {
  userId: number;
  processingId: number;
  fileId: number;
  partNumber: number;
  buffer?: Buffer;
}

/**
 * DTO for upload part
 */

export interface IUploadPartDto {
  partNumber: number;
  etag: string;
}

/**
 * DTO for complete upload part
 */

export interface ICompleteUploadRequestDto {
  userId: number;
  fileId: number;
  processingId: number;
  parts: IUploadPartDto[];
}

/**
 * DTO for download video part
 */

export interface IDownloadRequestDto {
  userId: number;
  fileId: number;
  quality: string;
}


/**
 * DTO for download file part
 */

export interface IDownloadFileRequestDto {
  userId: number;
  fileId: number;
}

/**
 * DTO for  upload part params
 */
export interface IUploadPartParams  {
  fileId: string;
  partNumber: string;
  processingId: string;
}

/**
 * DTO for complete upload params
 */
export interface ICompleteUploadPartParams  {
  fileId: string;
  processingId: string;
}

/**
 * DTO for file params
 */

export interface IFileParams {
  fileId: string;
}

/**
 * DTO for fileType params
 */

export interface IFileTypeParams  {
  type: string;
}

/**
 * DTO for download video params
 */

export interface IDownloadParams  {
  fileId: string;
  quality: string;
}

/**
 * DTO for download file params
 */

export interface IDownloadFileParams  {
  fileId: string;
}




/**
 * DTO for file count request
 */

export interface IGetFileCountRequestDto {
  userId: number;
}

/**
 * DTO for file status request
 */

export interface IGetFileStatusRequestDto {
  userId: number;
  fileId: number;
}





