import { toast } from 'react-toastify';
import { IFileDownloadProps } from '../props/file-download-props';
import service from '../service';
import MESSAGES from '../constants/message';
import { useEffect, useRef } from 'react';


/**
 * 
 * Business logic to download file
 */
const useFileDownload = () => {
  const controllerRef = useRef<AbortController | null>(null);

  const downloadFile = async (props: IFileDownloadProps) => {

    try {
      const controller = new AbortController();

      controllerRef.current = controller;

      const response =
        await service.fileDownloadService.downloadFile(
          props.fileId,
          controller.signal,
        );

      if (controller.signal.aborted) {
        return;
      }

      const link =
        document.createElement('a');

      link.href = response.url;

      link.download = 'document';

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to download');
    }

  };

  const downloadVideo = async (
    fileId: number,
    quality: string,
  ) => {

    try {

      const controller = new AbortController();

      controllerRef.current = controller;

      const response =
      await service.fileDownloadService.downloadVideo(
        fileId,
        quality,
        controller.signal,
      );

      if (controller.signal.aborted) {
        return;
      }
  
      if (response.url) {
        toast.success('Downloading file');
        window.open(response.url, '_blank');
        return;
      }

      if(!response.url){
        toast.success(MESSAGES.FILE.FILE_QUALITY_PROCESSING);
      }
  
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : MESSAGES.FILE.FAILED_DOWNLOAD);
    }


  };


  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  return {
    downloadVideo,
    downloadFile,
  };
};

export default useFileDownload;