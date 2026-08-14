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
  hasPreviousPage: false,
};

const useFileList = (fileType: string) => {
  const [files, setFiles] = useState<IFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const [pagination, setPagination] =
    useState<IPaginationDto>(DEFAULT_PAGINATION);

  const getFiles = async () => {
    try {
      setLoading(true);
      setError(null);

      const request: IFileRequestDto = {
        fileType,
        search,
        page,
        limit: 10,
      };

      const response = await fileService.getFiles(request);

      if (!response.result.length) {
        setFiles([]);
        setPagination(response.pagination);
        setError('No files found');
        return;
      }

      setFiles(response.result);
      setPagination(response.pagination);
    } catch (error) {
      console.error(error);
      setFiles([]);
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to load files',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [fileType, search]);

  useEffect(() => {
    getFiles();
  }, [fileType, page, search]);

  return {
    loading,
    files,
    error,
    pagination,
    fileType,
    search,
    setSearch,
    setPage,
    refreshFiles: getFiles,
  };
};

export default useFileList;