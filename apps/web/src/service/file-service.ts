import { API } from '../config/api-config';
import { IFileCountModelResponseDto, IFileRequestDto, IFileListResponseDto, IFileStatusResponseDto } from '../model/file/file-model';
import { IHeaderDto } from '../model/http/http-model';
import { httpService } from './base-service';



const fileCount = async (): Promise<IFileCountModelResponseDto> => {
  const { url, method } = API.FILE.FILE_COUNT;

  const request:IHeaderDto ={
    url:url,
    method:method,
    isFormData:false
  };
  const response =  await httpService<IFileCountModelResponseDto>(request);

  return response;
};


const getAllFilesTypes = async (
  request: IFileRequestDto,
): Promise<IFileListResponseDto> => {

  const { url, method } =
    API.FILE.GET_FILES_TYPE(
      request.fileType,
      request.page,
      request.limit,
    );

  const header: IHeaderDto = {
    url: url,
    method: method,
    isFormData: false

  };

  return await httpService(header);
};


const getFileStatus = async (fileId:number): Promise<IFileStatusResponseDto> => {
  const { url, method } = API.FILE.GET_FILES_STATUS(fileId);

  const request:IHeaderDto ={
    url:url,
    method:method,
    isFormData:false
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
): Promise<void> => {
  const { url, method } =
    API.FILE.DELETE_FILE(fileId);

  const request: IHeaderDto = {
    url:url,
    method:method,
    isFormData: false

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