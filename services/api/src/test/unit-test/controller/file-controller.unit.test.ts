import { jest } from '@jest/globals';

import type {
  ICreateUserRequestDto,
  ILoginRequestDto,
} from '../../../dto/request/auth-request-dto.js';

import type {
  ICompleteUploadRequestDto,
  IDeleteFileRequestDto,
  IDownloadFileRequestDto,
  IDownloadRequestDto,
  IGetFileCountRequestDto,
  IGetFilesRequestDto,
  IGetFileStatusRequestDto,
  IInitUploadRequestDto,
  IUploadFileRequestDto,
  IUploadPartRequestDto,
} from '../../../dto/request/file-request-dto.js';

import type {
  ICompleteUploadResponseDto,
  IDeleteFileResponseDto,
  IDownloadedResponseDto,
  IGetFileCountResponseDto,
  IGetFilesResponseDto,
  IGetFileStatusResponseDto,
  IInitUploadResponseDto,
  IUploadFileResponseDto,
  IUploadPartResponseDto,
} from '../../../dto/response/file-response-dto.js';


// -----------------------------------------------------------------------------
// Service mocks
// -----------------------------------------------------------------------------

const uploadFilesService = jest.fn<
  (body: IUploadFileRequestDto) => Promise<IUploadFileResponseDto>
>();

const initUpload = jest.fn<
  (body: IInitUploadRequestDto) => Promise<IInitUploadResponseDto>
>();

const getFilesService = jest.fn<
  (body: IGetFilesRequestDto) => Promise<IGetFilesResponseDto>
>();

const deleteFileService = jest.fn<
  (body: IDeleteFileRequestDto) => Promise<IDeleteFileResponseDto>
>();

const getFileStatus = jest.fn<
  (body: IGetFileStatusRequestDto) => Promise<IGetFileStatusResponseDto>
>();

const uploadPart = jest.fn<
  (body: IUploadPartRequestDto) => Promise<IUploadPartResponseDto>
>();

const completeUpload = jest.fn<
  (body: ICompleteUploadRequestDto) => Promise<ICompleteUploadResponseDto>
>();

const getFilesCount = jest.fn<
  (body: IGetFileCountRequestDto) => Promise<IGetFileCountResponseDto>
>();

const downloadVideo = jest.fn<
  (body: IDownloadRequestDto) => Promise<IDownloadedResponseDto>
>();

const downloadFiles = jest.fn<
  (body: IDownloadFileRequestDto) => Promise<IDownloadedResponseDto>
>();



jest.unstable_mockModule(
  '../../../service/index.js',
  () => ({
    default: {
      file: {
        uploadFilesService,
        initUpload,
        getFilesService,
        deleteFileService,
        getFileStatus,
        uploadPart,
        completeUpload,
        getFilesCount,
        downloadVideo,
        downloadFiles,
      },
    },
  }),
);



const { default: controller } =
  await import('../../../controller/index.js');


describe('File Controller', () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });



  describe('uploadFiles', () => {
    it('should upload files successfully', async () => {
      const req = {
        user: {
          id: 1,
        },
        uploadedFiles: [
          {
            originalname: 'test.jpg',
            mimetype: 'image/jpeg',
          },
        ],
      };

      const response = {
        message: 'File uploaded successfully',
        result: [
          {
            id: 1,
            name: 'test.jpg',
            mime_type: 'image/jpeg',
          },
        ],
      };

      uploadFilesService.mockResolvedValue(response as IUploadFileResponseDto);

      await controller.FileController.uploadFiles(
        req as any,
        res as any,
        next,
      );

      expect(uploadFilesService).toHaveBeenCalledWith({
        userId: 1,
        uploadedFiles: req.uploadedFiles,
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(response);
    });

    it('should call next when upload fails', async () => {
      const req = {
        user: {
          id: 1,
        },
        uploadedFiles: [],
      };

      const error = new Error('Upload failed');

      uploadFilesService.mockRejectedValue(error);

      await controller.FileController.uploadFiles(
        req as any,
        res as any,
        next,
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });



  describe('initUploadFiles', () => {
    it('should initialize upload successfully', async () => {
      const req = {
        user: {
          id: 1,
        },
        body: {
          fileName: 'test video.mp4',
          mimeType: 'video/mp4',
        },
      };

      const response = {
        message: 'Upload initialized successfully',
        result: {
          fileId: 1,
          processingId: 1,
        },
      };

      initUpload.mockResolvedValue(
        response as IInitUploadResponseDto,
      );

      await controller.FileController.initUploadFiles(
        req as any,
        res as any,
        next,
      );

      expect(initUpload).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 1,
          mimeType: 'video/mp4',
        }),
      );

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(response);
    });

    it('should call next when initialization fails', async () => {
      const req = {
        user: {
          id: 1,
        },
        body: {
          fileName: 'test.mp4',
          mimeType: 'video/mp4',
        },
      };

      const error = new Error('Initialization failed');

      initUpload.mockRejectedValue(error);

      await controller.FileController.initUploadFiles(
        req as any,
        res as any,
        next,
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });



  describe('getFiles', () => {
    it('should get files successfully', async () => {
      const req = {
        user: {
          id: 1,
        },
        params: {
          type: 'image',
        },
        query: {
          page: '2',
          limit: '10',
        },
      };

      const response = {
        message: 'Files fetched successfully',
        result: [],
        pagination: {
          page: 2,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };

      getFilesService.mockResolvedValue(
        response as IGetFilesResponseDto,
      );

      await controller.FileController.getFiles(
        req as any,
        res as any,
        next,
      );

      expect(getFilesService).toHaveBeenCalledWith({
        userId: 1,
        type: 'image',
        page: 2,
        limit: 10,
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(response);
    });

    it('should use default pagination values', async () => {
      const req = {
        user: {
          id: 1,
        },
        params: {
          type: 'image',
        },
        query: {},
      };

      const response = {
        message: 'Files fetched successfully',
        result: {},
        pagination: {},
      };

      getFilesService.mockResolvedValue(
        response as IGetFilesResponseDto,
      );

      await controller.FileController.getFiles(
        req as any,
        res as any,
        next,
      );

      expect(getFilesService).toHaveBeenCalledWith({
        userId: 1,
        type: 'image',
        page: 1,
        limit: 10,
      });
    });

    it('should call next when getting files fails', async () => {
      const req = {
        user: {
          id: 1,
        },
        params: {
          type: 'image',
        },
        query: {},
      };

      const error = new Error('Failed to fetch files');

      getFilesService.mockRejectedValue(error);

      await controller.FileController.getFiles(
        req as any,
        res as any,
        next,
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });



  describe('deleteFile', () => {
    it('should delete file successfully', async () => {
      const req = {
        params: {
          fileId: '1',
        },
      };

      const response = {
        message: 'File deleted successfully',
      };

      deleteFileService.mockResolvedValue(
        response as IDeleteFileResponseDto,
      );

      await controller.FileController.deleteFile(
        req as any,
        res as any,
        next,
      );

      expect(deleteFileService).toHaveBeenCalledWith({
        fileId: 1,
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(response);
    });

    it('should call next when delete fails', async () => {
      const req = {
        params: {
          fileId: '1',
        },
      };

      const error = new Error('Delete failed');

      deleteFileService.mockRejectedValue(error);

      await controller.FileController.deleteFile(
        req as any,
        res as any,
        next,
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });



  describe('getFileStatus', () => {
    it('should get file status successfully', async () => {
      const req = {
        user: {
          id: 1,
        },
        params: {
          fileId: '1',
        },
      };

      const response = {
        message: 'File status fetched successfully',
        status: 'completed',
      };

      getFileStatus.mockResolvedValue(
        response as IGetFileStatusResponseDto,
      );

      await controller.FileController.getFileStatus(
        req as any,
        res as any,
        next,
      );

      expect(getFileStatus).toHaveBeenCalledWith({
        fileId: 1,
        userId: 1,
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(response);
    });

    it('should call next when getting status fails', async () => {
      const req = {
        user: {
          id: 1,
        },
        params: {
          fileId: '1',
        },
      };

      const error = new Error('Status failed');

      getFileStatus.mockRejectedValue(error);

      await controller.FileController.getFileStatus(
        req as any,
        res as any,
        next,
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });


  describe('uploadPart', () => {
    it('should upload a video part successfully', async () => {
      const buffer = Buffer.from('video-part');

      const req = {
        user: {
          id: 1,
        },
        params: {
          fileId: '1',
          processingId: '1',
          partNumber: '1',
        },
        body: buffer,
      };

      const response = {
        partNumber: 1,
        etag: 'test-etag',
      };

      uploadPart.mockResolvedValue(
        response as IUploadPartResponseDto,
      );

      await controller.FileController.uploadPart(
        req as any,
        res as any,
        next,
      );

      expect(uploadPart).toHaveBeenCalledWith({
        userId: 1,
        fileId: 1,
        processingId: 1,
        partNumber: 1,
        buffer,
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(response);
    });

    it('should call next when request body is not a Buffer', async () => {
      const req = {
        user: {
          id: 1,
        },
        params: {
          fileId: '1',
          processingId: '1',
          partNumber: '1',
        },
        body: 'invalid-body',
      };

      await controller.FileController.uploadPart(
        req as any,
        res as any,
        next,
      );

      expect(next).toHaveBeenCalled();
    });

    it('should call next when upload part fails', async () => {
      const buffer = Buffer.from('video-part');

      const req = {
        user: {
          id: 1,
        },
        params: {
          fileId: '1',
          processingId: '1',
          partNumber: '1',
        },
        body: buffer,
      };

      const error = new Error('Part upload failed');

      uploadPart.mockRejectedValue(error);

      await controller.FileController.uploadPart(
        req as any,
        res as any,
        next,
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });




  describe('completeUpload', () => {
    it('should complete video upload successfully', async () => {
      const req = {
        user: {
          id: 1,
        },
        params: {
          fileId: '1',
          processingId: '1',
        },
        body: {
          parts: [
            {
              partNumber: 1,
              etag: 'test-etag',
            },
          ],
        },
      };

      const response = {
        message: 'Upload completed successfully',
        status: 'Completed'
  
      };

      completeUpload.mockResolvedValue(
        response as ICompleteUploadResponseDto,
      );

      await controller.FileController.completeUpload(
        req as any,
        res as any,
        next,
      );

      expect(completeUpload).toHaveBeenCalledWith({
        userId: 1,
        fileId: 1,
        processingId: 1,
        parts: req.body.parts,
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(response);
    });

    it('should call next when complete upload fails', async () => {
      const req = {
        user: {
          id: 1,
        },
        params: {
          fileId: '1',
          processingId: '1',
        },
        body: {
          parts: [],
        },
      };

      const error = new Error('Complete upload failed');

      completeUpload.mockRejectedValue(error);

      await controller.FileController.completeUpload(
        req as any,
        res as any,
        next,
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });




  describe('getFilesCount', () => {
    it('should get file count successfully', async () => {
      const req = {
        user: {
          id: 1,
        },
      };

      const response = {
        message: 'File count fetched successfully',
        result: {
          images: 5,
          videos: 3,
          document: 2,
        },
      };

      getFilesCount.mockResolvedValue(
        response as IGetFileCountResponseDto,
      );

      await controller.FileController.getFilesCount(
        req as any,
        res as any,
        next,
      );

      expect(getFilesCount).toHaveBeenCalledWith({
        userId: 1,
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(response);
    });

    it('should call next when getting file count fails', async () => {
      const req = {
        user: {
          id: 1,
        },
      };

      const error = new Error('Count failed');

      getFilesCount.mockRejectedValue(error);

      await controller.FileController.getFilesCount(
        req as any,
        res as any,
        next,
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });




  describe('downloadVideo', () => {
    it('should return 200 when video is ready', async () => {
      const req = {
        user: {
          id: 1,
        },
        params: {
          fileId: '1',
          quality: '720p',
        },
      };

      const response = {
        message: 'Video download URL generated successfully',
        url: 'http://localhost:9000/video-720p.mp4',
        status: 'completed',
      };

      downloadVideo.mockResolvedValue(
        response as IDownloadedResponseDto,
      );

      await controller.FileController.downloadVideo(
        req as any,
        res as any,
      );

      expect(downloadVideo).toHaveBeenCalledWith({
        userId: 1,
        fileId: 1,
        quality: '720p',
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(response);
    });

    it('should return 200 when video is pending', async () => {
      const req = {
        user: {
          id: 1,
        },
        params: {
          fileId: '1',
          quality: '720p',
        },
      };

      const response = {
        message: 'Video is still processing',
        status: 'Pending',
      };

      downloadVideo.mockResolvedValue(
        response as IDownloadedResponseDto,
      );

      await controller.FileController.downloadVideo(
        req as any,
        res as any,
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(response);
    });
  });




  describe('downloadFile', () => {
    it('should download file successfully', async () => {
      const req = {
        user: {
          id: 1,
        },
        params: {
          fileId: '1',
        },
      };

      const response = {
        message: 'File download URL generated successfully',
        url: 'http://localhost:9000/test-file.jpg',
        status: 'completed',
      };

      downloadFiles.mockResolvedValue(
        response as IDownloadedResponseDto,
      );

      await controller.FileController.downloadFile(
        req as any,
        res as any,
      );

      expect(downloadFiles).toHaveBeenCalledWith({
        fileId: 1,
        userId: 1,
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(response);
    });

    it('should return 200 when file is pending', async () => {
      const req = {
        user: {
          id: 1,
        },
        params: {
          fileId: '1',
        },
      };

      const response = {
        message: 'File is still processing',
        status: 'Pending', 
      };

      downloadFiles.mockResolvedValue(
        response as IDownloadedResponseDto,
      );

      await controller.FileController.downloadFile(
        req as any,
        res as any,
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(response);
    });
  });
});