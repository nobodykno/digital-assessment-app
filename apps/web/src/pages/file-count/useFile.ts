import { useEffect, useState } from 'react';
import { IFileCountModelResponseDto } from '../../model/file/file-model';
import service from '../../service';
import { toast } from 'react-toastify';




const useFile = () => {

  const [folders, setFolders] = useState<IFileCountModelResponseDto>({
    message: '',
    result: {
      images: 0,
      videos: 0,
      document: 0,
    },
  });

  const [loading, setLoading] = useState(true);

  const getFolderCount = async () => {
    try {
      setLoading(true);
      const response = await service.fileService.fileCount();
      toast.success(response.message);
      setFolders(response);
     
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFolderCount();
  }, []);

  return {
    folders,
    loading,
  };
};

export default useFile;