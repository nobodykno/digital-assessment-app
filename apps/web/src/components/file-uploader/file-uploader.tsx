import React from 'react';

import useFileUploader from '../../hooks/useFileUploader';
import { IFileUploaderProps } from '../../props/file-uploader-props';
import ProgressBar from '../file-progress-bar/file-progress-bar';

/**
 *
 * @param props
 * @returns file uploader view
 */
const FileUploader = (props: IFileUploaderProps) => {
  const {
    fileInputRef,
    handleChooseFile,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    isDragging,
    uploadProgress,
  } = useFileUploader(props);

  return (
    <div
      className="flex w-64 flex-col items-center gap-2 rounded-[var(--border-radius)] border-2
        border-dashed
        p-4
        border-[var(--color-border)]"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        id="file-upload"
        type="file"
        hidden
        multiple={props.fileType !== 'video'}
        accept={
          props.fileType === 'video'
            ? 'video/*'
            : props.fileType === 'image'
              ? 'image/*'
              : '.pdf,.doc,.docx,.txt'
        }
        aria-label={`Upload ${props.fileType} file${
          props.fileType !== 'video' ? 's' : ''
        }`}
        onChange={handleFileChange}
      />

      <p className="text-sm text-[var(--color-text-secondary)]">
        {isDragging
          ? 'Drop files here'
          : 'Drag and drop files here'}
      </p>

      <span className="text-sm text-[var(--color-text-secondary)]">
        or
      </span>

      <button
        type="button"
        onClick={handleChooseFile}
        className="
          rounded-[var(--border-radius)]
          bg-[var(--color-primary)]
          px-4
          py-2
          text-white
          focus-visible:outline-2
          focus-visible:outline-offset-2
          focus-visible:outline-[var(--color-primary)]
        "
      >
        Upload
      </button>

      <ProgressBar progress={uploadProgress} />
    </div>
  );
};

export default React.memo(FileUploader);