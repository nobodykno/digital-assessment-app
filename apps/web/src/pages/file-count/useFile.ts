import { useEffect, useState } from 'react';
import { IFileCountModelResponseDto } from '../../model/file/file-model';
import service from '../../service';
import { toast } from 'react-toastify';




const useFileCount = () => {

  const [error, setError] = useState<string>('');
  const [folders, setFolders] = useState<IFileCountModelResponseDto>({
    message: '',
    result: {
      images: 0,
      videos: 0,
      document: 0,
    },
  });

  const [loading, setLoading] = useState(true);

  const getFolderCount = async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      const response = await service.fileService.fileCount(signal);
      toast.success(response.message);
      setFolders(response);
     
    } catch (error) {
      
      if (
        error instanceof DOMException &&
        error.name === 'AbortError'
      ) {
        toast.error('Request cancelled');
        setError('Request cancelled');
      }
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
    const controller = new AbortController();
    getFolderCount(controller.signal);
    return () => {
      
      controller.abort();
    };
  }, []);

  return {
    folders,
    loading,
    error
  };
};

export default useFileCount;