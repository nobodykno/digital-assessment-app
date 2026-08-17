import { toast } from 'react-toastify';

import MESSAGES from '../constants/message';
import service from '../service';
import { useEffect, useRef } from 'react';


const useFileDelete = () => {
  const controllerRef = useRef<AbortController | null>(null);


  const deleteFile = async (
    fileId: number,
    onDeleteSuccess: () => void,
  ) => {

    try {
      const controller = new AbortController();

      controllerRef.current = controller;

      await service.fileService.deleteFile(
        fileId,
        controller.signal,
      );

      if (controller.signal.aborted) {
        return;
      }

      toast.success(
        MESSAGES.FILE.DELETE_FILE_SUCCESS,
      );

      onDeleteSuccess();

    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === 'AbortError'
      ) {
        toast.error(
          "Delete Request cancel"
        );
        return;
      }
      toast.error(
        MESSAGES.FILE.DELETE_FILE_FAIL,
      );


    }

  };

  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  return {
    deleteFile,
  };
};

export default useFileDelete;