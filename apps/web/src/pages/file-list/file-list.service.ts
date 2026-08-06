import { IFileRequestDto, IFileResponseDto } from '../../model/file/file-model';
import service from '../../service';

const getFiles = async (
  request: IFileRequestDto
): Promise<IFileResponseDto> => {

  const req: IFileRequestDto = {
    
    fileType: request.fileType,
    page: request.page,
    limit: 10,
    
  };
  const result = await service.fileService.getAllFilesTypes(req);

  const response: IFileResponseDto = {
    message: result.message,
    result: result.result,
    pagination: result.pagination

  };
  return response;
};
  


const fileService = {
  getFiles,
};

export default fileService;