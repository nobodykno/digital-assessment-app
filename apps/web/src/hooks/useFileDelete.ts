import { toast } from 'react-toastify';

import MESSAGES from '../constants/message';
import service from '../service';


const useFileDelete = () => {

  const deleteFile = async (
    fileId: number,
    onDeleteSuccess: () => void,
  ) => {

    try {

      await service.fileService.deleteFile(
        fileId,
      );

      toast.success(
        MESSAGES.FILE.DELETE_FILE_SUCCESS,
      );

      onDeleteSuccess();

    } catch (error) {

      toast.error(
        MESSAGES.FILE.DELETE_FILE_FAIL,
      );


    }

  };

  return {
    deleteFile,
  };
};

export default useFileDelete;