import { useEffect, useRef, useState } from 'react';
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
  const controllerRef = useRef<AbortController | null>(null);
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

    const controller = new AbortController();

    controllerRef.current = controller;

    if (!validFiles.length) {
      return;
    }

    try {
      setUploadProgress(0);

      if (props.fileType === 'video') {
        await uploadVideo(validFiles[0], controller.signal);
      } else {
        await uploadFiles(validFiles, controller.signal);
      }
    } catch (error) {

      toast.error(
        error instanceof Error
          ? error.message
          : MESSAGES.FILE.FAILED_UPLOAD,
      );
      if (
        error instanceof DOMException &&
        error.name === 'AbortError'
      ) {
        toast.error('Upload Cancelled');
        return;
      }
  
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
  const uploadFiles = async (files: File[], signal: AbortSignal) => {
    const response = await service.fileUploadService.uploadFiles(files, signal);

    const imageFileIds = files
      .map((file, index) => ({
        fileId: response.result[index].id,
        isImage: file.type.startsWith('image/'),
      }))
      .filter((file) => file.isImage)
      .map((file) => file.fileId);

    if (imageFileIds.length > 0) {
      await pollImages(imageFileIds, signal);
    }

    props.onUploadSuccess();
  };

  /**
   * Upload Video.
   */
  const uploadVideo = async (file: File, signal: AbortSignal) => {
    const request: IInitUploadRequestDto = {
      fileName: file.name,
      mimeType: file.type,
    };

    const response =
      await service.fileUploadService.initializeUpload(request, signal);

    const { fileId, processingId } = response.result;

    const uploadedParts = await uploadChunks(
      file,
      fileId,
      processingId,
      signal
    );

    const payload: ICompleteUploadRequestDto = {
      fileId:fileId,
      processingId:processingId,
      parts: uploadedParts,
    };

    await completeUpload(payload, signal);

    await pollThumbnail(fileId, signal);

    props.onUploadSuccess();
  };

  /**
   * Upload Video Chunks.
   */
  const uploadChunks = async (
    file: File,
    fileId: number,
    processingId: number,
    signal:AbortSignal
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

      if (signal.aborted) {

        toast.error('Upload Cancelled');
        throw new DOMException(
          'Upload cancelled',
          'AbortError',
        );
      }

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
        await service.fileUploadService.uploadPart(req, signal);

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
    signal:AbortSignal
  ): Promise<ICompleteUploadResponseDto> => {
    setUploadProgress(100);
    return await service.fileUploadService.completeUpload(request, signal);
  };

  /**
   * Poll Until Thumbnail Generated.
   */
  const pollThumbnail = async (
    fileId: number,
    signal: AbortSignal
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const response =
            await service.fileService.getFileStatus(fileId, signal);

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

      signal.addEventListener(
        'abort',
        () => {
          clearInterval(interval);
          toast.error('Upload Request cancelled');
          reject(
            new DOMException(
              'Request cancelled',
              'AbortError',
            ),
          );
        },
        { once: true },
      );
    });
  };

  /**
   * Poll Multiple Images.
   */
  const pollImages = async (fileIds: number[], signal: AbortSignal) => {
    await Promise.all(
      fileIds.map((fileId) =>pollThumbnail(fileId, signal))
    );
  };


  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
    };
  }, []);


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