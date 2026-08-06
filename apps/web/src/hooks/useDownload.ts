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

      console.error(error);

    }

  };

  const downloadVideo = async (
    fileId: number,
    quality: string,
  ) => {
    const response =
      await service.fileDownloadService.downloadVideo(
        fileId,
        quality,
      );
  
    if (response.url) {
      window.open(response.url, '_blank');
      return;
    }
  
    toast.info(MESSAGES.DOWNLOAD_QUALITY.QUALITY_MISSING);
  };




  return {
    downloadVideo,
    downloadFile,
  };
};

export default useFileDownload;