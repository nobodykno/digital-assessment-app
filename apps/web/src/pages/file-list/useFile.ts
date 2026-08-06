import { useEffect, useState } from 'react';

import fileService from './file-list.service';
import {
  IFile,
  IFileRequestDto,
  IPaginationDto,
} from '../../model/file/file-model';


const DEFAULT_PAGINATION: IPaginationDto = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
  hasNextPage: true,
  hasPreviousPage: false
};

const useFileList = (fileType: string) => {
  const [files, setFiles] = useState<IFile[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);

  const [pagination, setPagination] =
    useState<IPaginationDto>(DEFAULT_PAGINATION);

  const getFiles = async () => {
    try {
      setLoading(true);

      const request: IFileRequestDto = {
        fileType,
        page,
        limit: 10,
      };

      const response = await fileService.getFiles(request);

      setFiles(response.result);
      setPagination(response.pagination);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFiles();
  }, [fileType, page]);

  return {
    loading,
    files,
    pagination,
    fileType,
    setPage,
    refreshFiles: getFiles,
  };
};

export default useFileList;