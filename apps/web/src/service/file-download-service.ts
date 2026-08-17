import API from '../config/api-config';
import { IDownloadResponseDto, IFileStatusResponseDto, IVideoStatusResponseDto } from '../model/file/file-model';
import { IHeaderDto } from '../model/http/http-model';
import { httpService } from './base-service';



const downloadFile = async (
  fileId: number,
  signal: AbortSignal
): Promise<IDownloadResponseDto> => {

  const { url, method } =
    API.FILE.DOWNLOAD_FILE(fileId);

  const request: IHeaderDto = {
    url: url,
    method: method,
    isFormData: false,
    requiresAuth: true
  };

  return await httpService<IDownloadResponseDto>(request);
};


const getVideoStatus = async (
  fileId: number,
  signal: AbortSignal
): Promise<IFileStatusResponseDto> => {
  
  const { url, method } =
      API.FILE.GET_FILES_STATUS(fileId);
  
  const request: IHeaderDto = {
    url:url,
    method:method,
    isFormData: false,
    requiresAuth: true,
    signal: signal
  };
  
  return await httpService<IFileStatusResponseDto>(request);
};

const downloadVideo= async (
  fileId: number,
  quality: string,
  signal?: AbortSignal
): Promise<IDownloadResponseDto> => {
  
  const { url, method } =
      API.FILE.DOWNLOAD_VIDEO(fileId,quality);
  
  const request: IHeaderDto = {
    url: url,
    method: method,
    isFormData: false,
    requiresAuth: true,
    signal: signal
  };
  
  return await httpService<IDownloadResponseDto>(request);
};
export default {
  downloadFile,
  downloadVideo,
  getVideoStatus
};