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

const CHUNK_SIZE = 10 * 1024 * 1024;

/**
 * 
 * Business logic to upload files
 *  
 */

const useFileUploader = (props: IFileUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadProgress, setUploadProgress] = useState(0);
  
  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFiles = event.target.files;

    if (!selectedFiles || selectedFiles.length === 0) {
      return;
    }

    try {
      if (props.fileType === 'video') {
        await uploadVideo(selectedFiles[0]);
      } else {
        await uploadFiles(Array.from(selectedFiles));
      }
    } catch (error) {
      console.error(error);
    } finally {
      event.target.value = '';
    }
  };

  /**
   * Upload Images / Documents
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
   * Upload Video
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
   * Upload Video Chunks
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
   * Complete Multipart Upload
   */
  const completeUpload = async (
    request: ICompleteUploadRequestDto,
  ): Promise<ICompleteUploadResponseDto> => {
    setUploadProgress(100);
    props.onUploadSuccess();
    return await service.fileUploadService.completeUpload(request);
  };

  /**
   * Poll Until Thumbnail Generated
   */
  const pollThumbnail = async (
    fileId: number,
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const response =
            await service.fileService.getFileStatus(fileId);

          if (response.status !== 'COMPLETED') {
            clearInterval(interval);
            resolve();
          }
        } catch (error) {
          clearInterval(interval);
          reject(error);
        }
      }, 2000);
    });
  };

  /**
   * Poll Multiple Images
   */
  const pollImages = async (
    fileIds: number[],
  ) => {
    await Promise.all(
      fileIds.map((fileId) => pollThumbnail(fileId)),
    );
  };

  return {
    fileInputRef,
    handleChooseFile,
    handleFileChange,
    uploadProgress
  };
};

export default useFileUploader;


