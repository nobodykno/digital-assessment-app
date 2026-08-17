import { useState } from 'react';
import useFileDownload from '../../hooks/useDownload';
import { IVideoDownloadProps } from '../../props/video-download-button-props';


/**
 * 
 * @param props 
 * @returns video download view
 */

const VideoDownload = (props: IVideoDownloadProps) => {
  const [quality, setQuality] = useState('720p');

  const { downloadVideo } = useFileDownload();

  return (
    <div className="flex items-center gap-2">

      <label htmlFor={`video-quality-${props.fileId}`} 
        className="text-sm text-[var(--color-text-secondary)]">
        Quality
      </label>
      <select
        id={`video-quality-${props.fileId}`}
        value={quality}
        onChange={(e) => setQuality(e.target.value)}
        className="rounded border border-[var(--color-border)] p-1"
      >
        <option value="360p">360P</option>
        <option value="720p">720P</option>
        <option value="1080p">1080P</option>
      </select>

      <button
        type="button"
        onClick={() => downloadVideo(props.fileId, quality)}
        className="rounded border border-[var(--color-border)] px-3 py-1"
      >
        Download
      </button>
    </div>
  );
};

export default VideoDownload;