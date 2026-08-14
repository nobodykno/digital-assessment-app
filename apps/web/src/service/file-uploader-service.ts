import { API } from '../config/api-config';
import { ICompleteUploadRequestDto, ICompleteUploadResponseDto, IInitUploadRequestDto, IInitUploadResponseDto, IUploadFileResponseDto, IUploadPartRequestDto, IUploadPartResponseDto } from '../model/file/file-model';
import { IHeaderDto } from '../model/http/http-model';
import { httpService } from './base-service';


/**
 * Upload Images / Documents
 */
const uploadFiles = async (
  files: File[],
): Promise<IUploadFileResponseDto> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  const { url, method } = API.FILE.UPLOAD_FILE;

  const request: IHeaderDto = {
    url,
    method,
    isFormData: true,
    requiresAuth: true
  };
  return await httpService<IUploadFileResponseDto>(request, formData);
};

/**
 * Initialize Video Upload
 */
const initializeUpload = async (
  requestBody: IInitUploadRequestDto,
): Promise<IInitUploadResponseDto> => {
  const { url, method } = API.FILE.INIT_UPLOAD;

  const request: IHeaderDto = {
    url,
    method,
    isFormData: false,
    requiresAuth: true
  };

  return await httpService<IInitUploadResponseDto>(request, requestBody);
};

/**
 * Upload One Chunk
 */
const uploadPart = async (req: IUploadPartRequestDto): Promise<IUploadPartResponseDto> => {
  const { url, method } = API.FILE.UPLOAD_PART(req.fileId,req.processingId, req.partNumber);

  const request = {
    url: url,
    method: method,
    isFormData: true,
    requiresAuth: true
  };

 

  return await httpService<IUploadPartResponseDto>(request, req.chunk,);
};

/**
 * Complete Multipart Upload
 */
const completeUpload = async (req:ICompleteUploadRequestDto): Promise<ICompleteUploadResponseDto> => {
  const { url, method } = API.FILE.COMPLETE_UPLOAD(req.fileId,req.processingId);

  const request: IHeaderDto = {
    url: url,
    method: method,
    isFormData:false,
    requiresAuth: true
  };



  return await httpService<ICompleteUploadResponseDto>(request, {parts:req.parts});
};

const fileUploadService = {
  uploadFiles,
  initializeUpload,
  uploadPart,
  completeUpload,
};

export default fileUploadService;