import { useEffect, useRef, useState } from 'react';

import fileService from './file-list.service';
import {
  IFile,
  IFileRequestDto,
  IPaginationDto,
} from '../../model/file/file-model';
import { toast } from 'react-toastify';

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

  const controllerRef = useRef<AbortController | null>(null);

  const [pagination, setPagination] =
    useState<IPaginationDto>(DEFAULT_PAGINATION);

  const getFiles = async (signal: AbortSignal) => {
    try {
      setLoading(true);
      setError(null);

      const request: IFileRequestDto = {
        fileType,
        search,
        page,
        limit: 10,
      };

      const response = await fileService.getFiles(request,signal);

      if (!response.result.length) {
        setFiles([]);
        setPagination(response.pagination);
        setError('No files found');
        return;
      }

      setFiles(response.result);
      setPagination(response.pagination);
    } catch (error) {
      if (
        error instanceof DOMException &&
            error.name === 'AbortError'
      ) {
        toast.error('Request cancelled');
        setError('Request cancelled');
      }
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

  const refreshFiles = async (): Promise<void> => {
    // Cancel previous refresh request if one exists.
    controllerRef.current?.abort();

    const controller = new AbortController();

    controllerRef.current = controller;

    await getFiles(controller.signal);
  };


  useEffect(() => {
    setPage(1);
  }, [fileType, search]);

  useEffect(() => {
    const controller = new AbortController();

    controllerRef.current = controller;

    getFiles(controller.signal);

    return () => {
      controller.abort();
    };

    
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
    refreshFiles
  };
};

export default useFileList;