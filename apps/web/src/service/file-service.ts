import { API } from '../config/api-config';
import { IFileCountModelResponseDto, IFileRequestDto, IFileListResponseDto, IFileStatusResponseDto } from '../model/file/file-model';
import { IHeaderDto } from '../model/http/http-model';
import { httpService } from './base-service';



const fileCount = async ( signal?: AbortSignal): Promise<IFileCountModelResponseDto> => {
  const { url, method } = API.FILE.FILE_COUNT;

  const request:IHeaderDto ={
    url:url,
    method:method,
    isFormData:false,
    requiresAuth: true,
    signal: signal
  };
  const response =  await httpService<IFileCountModelResponseDto>(request);

  return response;
};


const getAllFilesTypes = async (
  request: IFileRequestDto,
  signal?: AbortSignal
): Promise<IFileListResponseDto> => {

  const { url, method } =
    API.FILE.GET_FILES_TYPE(
      request.fileType,
      request.page,
      request.limit,
      request.search
    );

  const header: IHeaderDto = {
    url: url,
    method: method,
    isFormData: false,
    requiresAuth: true,
    signal:signal

  };

  return await httpService(header);
};


const getFileStatus = async (
  fileId:number,
  signal: AbortSignal

): Promise<IFileStatusResponseDto> => {
  const { url, method } = API.FILE.GET_FILES_STATUS(fileId);

  const request:IHeaderDto ={
    url:url,
    method:method,
    isFormData:false,
    requiresAuth: true,
    signal: signal
  };
  const result =  await httpService<IFileStatusResponseDto>(request);

  const response: IFileStatusResponseDto = {
    message: result.message,
    status: result.status
  };

  return response;
};

const deleteFile = async (
  fileId: number,
  signal?: AbortSignal
): Promise<void> => {
  const { url, method } =
    API.FILE.DELETE_FILE(fileId);

  const request: IHeaderDto = {
    url:url,
    method:method,
    isFormData: false,
    requiresAuth: true,
    signal:signal

  };

  await httpService(request);
};


const fileService ={
  fileCount,
  getAllFilesTypes,
  getFileStatus,
  deleteFile
};

export default fileService;