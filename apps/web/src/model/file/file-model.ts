

/** 
 * all required model file function
*/

/** 
 * file type
*/
export interface IFile {
  id: number;
  name: string;
  type: string;
  uploadedAt: string;

  thumbnail_image?: string;

  status?: string;

};

/** 
 * file count response
*/


export interface IFileCountModelResponseDto {
  message: string;
  result: {
    images: number;
    videos: number;
    document: number;
  };
};

/** 
 * pagination
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
 * file response
*/

export interface IFileResponseDto {
  message: string;
  result: IFile[];
  pagination: IPaginationDto;
}

/** 
 * file request
*/

export interface IFileRequestDto {
  fileType: string,
  page: number;
  limit: number;
  search: string
};


/** 
 * file list response
*/


export interface IFileListResponseDto {
  message: string;
  result: IFile[];

  pagination: IPaginationDto;
}

/** 
 * upload file response
*/
export interface IUploadFileResponseDto {
  message: string;
  result: IFile[];
}



/** 
 * init upload
*/


export interface IInitUploadRequestDto {
  fileName: string;
  mimeType: string;
}

/**
 *  for upload part
 */
export interface IUploadPartRequestDto {
  processingId: number;
  fileId: number;
  partNumber: number;
  chunk: ArrayBuffer;
}

/**
 *  for upload part
 */

export interface IUploadPartDto {
  partNumber: number;
  etag: string;
}

/**
 *  for complete upload part
 */

export interface ICompleteUploadRequestDto {
  fileId: number;
  processingId: number;
  parts: IUploadPartDto[];
}




export interface IInitUploadResponseDto {
  message: string;
  result: {
    fileId: number;
    processingId: number;
    objectName: string;
  };
}

/**
 *  for partUpload file response
 */
export interface IUploadPartResponseDto {
  partNumber: number;
  etag: string;
}

/**
 *  for completeUpload file response
 */

export interface ICompleteUploadResponseDto {
  message: string;
  status: string;
}

export interface IFileStatusResponseDto {
 message:string,
 status: string
}

export interface IDownloadResponseDto {
message:string,
url: string
}

export interface IVideoStatusResponseDto {
  message: string;
  result: {
    status: string
    downloadUrl?: string;
  };
}