import { toast } from 'react-toastify';
import { IFileDownloadProps } from '../props/file-download-props';
import service from '../service';
import MESSAGES from '../constants/message';


/**
 * 
 * Business logic to download file
 */
const useFileDownload = () => {

  const downloadFile = async (props: IFileDownloadProps) => {

    try {

      const response =
        await service.fileDownloadService.downloadFile(
          props.fileId,
        );

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
      : 'Failed to download')
    }

  };

  const downloadVideo = async (
    fileId: number,
    quality: string,
  ) => {

    try {
      const response =
      await service.fileDownloadService.downloadVideo(
        fileId,
        quality,
      );
  
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
      : MESSAGES.FILE.FAILED_DOWNLOAD)
    }


  }




  return {
    downloadVideo,
    downloadFile,
  };
};

export default useFileDownload;