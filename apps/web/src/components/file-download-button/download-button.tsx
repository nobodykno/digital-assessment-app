import useFileDownload from '../../hooks/useDownload';
import { IDownloadButtonProps } from '../../props/download-buttton-props';


/**
 * 
 * @param props 
 * @returns download button view
 */

const DownloadButton = (props: IDownloadButtonProps) => {

  const {
    downloadFile,
  } = useFileDownload();

  return (
    <button
      type="button"
      onClick={() => downloadFile(props)}
      className="
        rounded-[var(--border-radius)]
        border
        border-[var(--color-border)]
        px-3
        py-1
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-[var(--color-primary)]
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      Download
    </button>
  );
};

export default DownloadButton;


