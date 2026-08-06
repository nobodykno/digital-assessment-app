/**
 * DTO for file type
 */

export interface IFileDto {
  id: number;
  user_id: number;
  name: string;
  file_name: string;
  size: number;
  mime_type: string;
  path: string;
  thumbnail_image?: string | null;
  uploadedAt: Date;
  status: string;
}

/**
 * DTO for upload file response
 */

export interface IUploadFileResponseDto {
  message: string;
  result: IFileDto[];
}




/**
 * DTO for delete file response
 */

export interface IDeleteFileResponseDto {
  message: string;
}

/**
 * DTO for get status file response
 */

export interface IGetFileStatusResponseDto {
  message: string;
  status: string;
}
/**
 * DTO for initupload file response
 */
export interface IInitUploadResponseDto {
  message: string;
  result: {
    fileId: number;
    processingId: number;
    objectName: string;
  };
}

/**
 * DTO for partUpload file response
 */
export interface IUploadPartResponseDto {
  partNumber: number;
  etag: string;
}

/**
 * DTO for completeUpload file response
 */

export interface ICompleteUploadResponseDto {
  message: string;
  status: string;
}

/**
 * DTO for download file response
 */

export interface IDownloadedResponseDto {
  message: string;
  status: string;
  url?: string;
}

/**
 * Dto for paginated query
 */

export interface IPaginationDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * DTO for get file response
 */


export interface IGetFilesResponseDto {
  message: string;
  result: IFileDto[];
  pagination: IPaginationDto;
}


/**
 * Delete file Dto
 */
export interface IDeleteFilesResponseDto {
  message: string;
}


/**
 * DTO for file count response
 */

export interface IGetFileCountResponseDto {
  message: string;
  result: {
    images: number;
    videos: number;
    document: number;
  };
}