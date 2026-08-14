import { useRef, useState } from 'react';
import service from '../service';

import {
  ICompleteUploadRequestDto,
  ICompleteUploadResponseDto,
  IInitUploadRequestDto,
  IUploadPartDto,
  IUploadPartRequestDto,
} from '../model/file/file-model';

import { IFileUploaderProps } from '../props/file-uploader-props';
import { toast } from 'react-toastify';
import MESSAGES from '../constants/message';

const CHUNK_SIZE = 10 * 1024 * 1024;

const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

/**
 * Business logic to upload files
 */
const useFileUploader = (props: IFileUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  /**
   * Validate a single file according to the selected file type.
   */
  const isValidFile = (file: File): boolean => {
    if (props.fileType === 'image') {
      return file.type.startsWith('image/');
    }

    if (props.fileType === 'video') {
      return file.type.startsWith('video/');
    }

    if (props.fileType === 'document') {
      return ALLOWED_DOCUMENT_TYPES.includes(file.type);
    }

    return false;
  };

  /**
   * Validate selected or dropped files.
   */
  const validateFiles = (files: File[]): File[] => {
    const invalidFiles = files.filter(
      (file) => !isValidFile(file),
    );

    if (invalidFiles.length > 0) {
      toast.error(
        `Only ${props.fileType} files are allowed.`,
      );

      return [];
    }

    return files;
  };

  /**
   * Open file picker.
   */
  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  /**
   * Common upload handler for file picker and drag-and-drop.
   */
  const uploadSelectedFiles = async (files: File[]) => {
    const validFiles = validateFiles(files);

    if (!validFiles.length) {
      return;
    }

    try {
      setUploadProgress(0);

      if (props.fileType === 'video') {
        await uploadVideo(validFiles[0]);
      } else {
        await uploadFiles(validFiles);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : MESSAGES.FILE.FAILED_UPLOAD,
      );
    }
  };

  /**
   * Handle file picker selection.
   */
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFiles = event.target.files;

    if (!selectedFiles?.length) {
      return;
    }

    await uploadSelectedFiles(Array.from(selectedFiles));

    event.target.value = '';
  };

  /**
   * Handle drag over.
   */
  const handleDragOver = (
    event: React.DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    setIsDragging(true);
  };

  /**
   * Handle drag leave.
   */
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  /**
   * Handle dropped files.
   */
  const handleDrop = async (
    event: React.DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(
      event.dataTransfer.files,
    );

    if (!droppedFiles.length) {
      return;
    }

    await uploadSelectedFiles(droppedFiles);
  };

  /**
   * Upload Images / Documents.
   */
  const uploadFiles = async (files: File[]) => {
    const response = await service.fileUploadService.uploadFiles(files);

    const imageFileIds = files
      .map((file, index) => ({
        fileId: response.result[index].id,
        isImage: file.type.startsWith('image/'),
      }))
      .filter((file) => file.isImage)
      .map((file) => file.fileId);

    if (imageFileIds.length > 0) {
      await pollImages(imageFileIds);
    }

    props.onUploadSuccess();
  };

  /**
   * Upload Video.
   */
  const uploadVideo = async (file: File) => {
    const request: IInitUploadRequestDto = {
      fileName: file.name,
      mimeType: file.type,
    };

    const response =
      await service.fileUploadService.initializeUpload(request);

    const { fileId, processingId } = response.result;

    const uploadedParts = await uploadChunks(
      file,
      fileId,
      processingId,
    );

    const payload: ICompleteUploadRequestDto = {
      fileId:fileId,
      processingId:processingId,
      parts: uploadedParts,
    };

    await completeUpload(payload);

    await pollThumbnail(fileId);

    props.onUploadSuccess();
  };

  /**
   * Upload Video Chunks.
   */
  const uploadChunks = async (
    file: File,
    fileId: number,
    processingId: number,
  ): Promise<IUploadPartDto[]> => {
    const uploadedParts: IUploadPartDto[] = [];

    const totalParts = Math.ceil(
      file.size / CHUNK_SIZE,
    );

    for (
      let partNumber = 1;
      partNumber <= totalParts;
      partNumber++
    ) {
      const start =
        (partNumber - 1) * CHUNK_SIZE;

      const end = 
      Math.min(
        start + CHUNK_SIZE,
        file.size,
      );

      const chunk = file.slice(start, end);
      const buffer = await chunk.arrayBuffer();

      const req: IUploadPartRequestDto = {
        fileId: fileId,

        processingId: processingId,

        partNumber: partNumber,

        chunk: buffer
      };

      const response =
        await service.fileUploadService.uploadPart(req);

      uploadedParts.push({
        partNumber,
        etag: response.etag,
      });

      setUploadProgress(
  
        Math.round(
  
          (partNumber / totalParts) * 100
  
        )
  
      );

    }

    return uploadedParts;
  };

  /**
   * Complete Multipart Upload.
   */
  const completeUpload = async (
    request: ICompleteUploadRequestDto,
  ): Promise<ICompleteUploadResponseDto> => {
    setUploadProgress(100);
    return await service.fileUploadService.completeUpload(request);
  };

  /**
   * Poll Until Thumbnail Generated.
   */
  const pollThumbnail = async (
    fileId: number,
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const response =
            await service.fileService.getFileStatus(fileId);

          if (response.status === 'Completed') {
            clearInterval(interval);
            resolve();
          }

          if (response.status === 'Failed') {
            clearInterval(interval);
            reject(new Error('File processing failed'));
          }
        } catch (error) {
          clearInterval(interval);
          reject(error);
        }
      }, 2000);
    });
  };

  /**
   * Poll Multiple Images.
   */
  const pollImages = async (fileIds: number[]) => {
    await Promise.all(
      fileIds.map((fileId) =>pollThumbnail(fileId))
    );
  };

  return {
    fileInputRef,
    handleChooseFile,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    isDragging,
    uploadProgress,
  };
};

export default useFileUploader;