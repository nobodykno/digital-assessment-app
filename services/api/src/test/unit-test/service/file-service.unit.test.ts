import { jest } from '@jest/globals';

import repository from '@dam/database/repositories';
import utils from '../../../utils/index.js';
import model from '@dam/database/models';
import serviceStorage from '@dam/shared/storage';
import FileProcessing from '../../../../../../packages/database/dist/models/file-processing-model.js';
import { IFileProcessingCreateAttributes } from '../../../../../../packages/database/dist/types/file-processing-type.js';

const bulkCreate = jest.fn() as jest.MockedFunction<
  typeof repository.fileRepository.bulkCreate
>;

const findAllByType = jest.fn() as jest.MockedFunction<
  typeof repository.fileRepository.findAllByType
>;

const initMultipartUpload = jest.fn() as jest.MockedFunction<
  typeof serviceStorage.s3Service.initMultipartUpload
>;



const getFileCounts = jest.fn() as jest.MockedFunction<
  typeof repository.fileRepository.getFileCounts
>;

const findFileByPrimaryKey = jest.fn() as jest.MockedFunction<
  typeof repository.fileRepository.findFileByPrimaryKey
>;

const validateFileId = jest.fn() as jest.MockedFunction<
typeof utils.idValidators.validateFileId
>;

const createFile = jest.fn() as jest.MockedFunction<
  typeof repository.fileRepository.createFile
>;

const updateFilePath = jest.fn() as jest.MockedFunction<
  typeof repository.fileRepository.updateFilePath
>;

const createFIleProcessing = jest.fn() as jest.MockedFunction<
  typeof repository.fileRepository.createFIleProcessing
>;

const findUploadId = jest.fn() as jest.MockedFunction<
  typeof repository.fileRepository.findUploadId
>;

const updateFileProcessingStatus = jest.fn() as jest.MockedFunction<
  typeof repository.fileRepository.updateFileProcessingStatus
>;

const updateFileStatus = jest.fn() as jest.MockedFunction<
  typeof repository.fileRepository.updateFileStatus
>;

const uploadPartMock = jest.fn() as jest.MockedFunction<
  typeof serviceStorage.s3Service.uploadPart
>;

const findByPk = jest.spyOn(
    model.FileProcessing,
    'findByPk',
  );
  
  const completeMultipartUpload = jest.fn() as jest.MockedFunction<
    typeof serviceStorage.s3Service.completeMultipartUpload
  >;
  

const findVideoQuality = jest.fn() as jest.MockedFunction<
  typeof repository.videoQualityRepository.findVideoQuality
>;


const getObjectUrl = jest.fn() as jest.MockedFunction<
  typeof serviceStorage.storageService.getObjectUrl
>;
const generateVIdeo = jest.fn();

const deleteObject = jest.fn();

const validateUserId = jest.fn();

const publishMessage = jest.fn();

jest.unstable_mockModule('@dam/database/repositories', () => ({
  default: {
    fileRepository: {
      bulkCreate,
      findAllByType,
      getFileCounts,
      findFileByPrimaryKey,
      createFile,
      updateFilePath,
      createFIleProcessing,
      findUploadId,
      updateFileProcessingStatus,
      updateFileStatus
    },
    videoQualityRepository :{
        findVideoQuality
    }
  },
}));

jest.unstable_mockModule('@dam/shared/storage', () => ({
  default: {
    storageService: {
      deleteObject,
      getObjectUrl,
    },

    s3Service: {
      uploadPart: uploadPartMock,
      initMultipartUpload,
      completeMultipartUpload,
    },
  },
}));


  jest.unstable_mockModule('../../../utils/index.js', () => ({
    default: {
      idValidators: {
        validateUserId,
        validateFileId,
      },
    },
  }));

  jest.unstable_mockModule('@dam/shared', () => ({
    default: {
      rabbitmq: {
        rabbitmqService: {
          publishMessage,
        },
        rabbitMQQueues: {
          image: 'image',
          video: 'video',
        },
      },
    },
  }));



  jest.unstable_mockModule('../../../object/dam-object.js', () => ({
    default: {
      generateVIdeo,
    },
  }));

const { uploadFilesService } =
  await import('../../../service/file-service.js');

  const {getFilesService}  =  
  await import('../../../service/file-service.js');

  const { getFilesCount } = 
  await import('../../../service/file-service.js');

 

  const { 
    initUpload, 
    uploadPart, 
    completeUpload ,
    deleteFileService,
    downloadVideo
} = 
  await import ('../../../service/file-service.js')

  


  describe('uploadFilesService', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
   it('should upload files successfully', async () => {
        const createdFile = model.File.build({
            id: 1,
            user_id: 1,
            name: 'test.jpg',
            file_name: 'test.jpg',
            size: 1000,
            mime_type: 'image/jpeg',
            path: 'user/1/test.jpg',
            thumbnail_image: '',
            type: 'image',
            status: 'PENDING',
          });
          
      
        bulkCreate.mockResolvedValue([createdFile]);
      
        const result = await uploadFilesService({
          userId: 1,
          uploadedFiles: [
            {
              originalName: 'test.jpg',
              size: 1000,
              mimeType: 'image/jpeg',
              objectName: 'user/1/test.jpg',
              etag: 'etag',
            },
          ],
        });
      
        expect(validateUserId).toHaveBeenCalledWith(1);
      
        expect(bulkCreate).toHaveBeenCalledWith([
          {
            user_id: 1,
            name: 'test.jpg',
            file_name: 'test.jpg',
            size: 1000,
            mime_type: 'image/jpeg',
            path: 'user/1/test.jpg',
            thumbnail_image: '',
            type: 'image',
            status: expect.any(String),
          },
        ]);
      
        expect(publishMessage).toHaveBeenCalledWith(
          'image',
          {
            fileId: 1,
            userId: 1,
            objectName: 'user/1/test.jpg',
            mimeType: 'image/jpeg',
          },
        );
      
        expect(result).toEqual({
          message: expect.any(String),
          result: [createdFile],
        });
      });
  });

  describe('getFilesService', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return files with pagination', async () => {
        const file = model.File.build({
            id: 1,
            user_id: 1,
            name: 'test.jpg',
            file_name: 'test.jpg',
            size: 1000,
            mime_type: 'image/jpeg',
            path: 'test/test.jpg',
            thumbnail_image: '',
            type: 'image',
            status: 'COMPLETED',
          });
  
      findAllByType.mockResolvedValue({
        rows : [file],
        count: 15,
      });
  
      const result = await getFilesService({
        userId: 1,
        type: 'image',
        page: 1,
        limit: 10,
      });
  
      expect(findAllByType).toHaveBeenCalledWith(
        1,
        'image',
        1,
        10,
      );
  
      expect(result).toEqual({
        message: expect.any(String),
        result: [file],
        pagination: {
          page: 1,
          limit: 10,
          total: 15,
          totalPages: 2,
          hasNextPage: true,
          hasPreviousPage: false,
        },
      });
    });
  });

  describe('getFilesCount', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return file counts successfully', async () => {
      getFileCounts.mockResolvedValue({
        images: 5,
        videos: 3,
        others: 2,
      });
  
      const result = await getFilesCount({
        userId: 1,
      });
  
      expect(getFileCounts).toHaveBeenCalledWith(1);
  
      expect(result).toEqual({
        message: expect.any(String),
        result: {
          images: 5,
          videos: 3,
          document: 2,
        },
      });
    });
  });

  describe('deleteFileService', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should delete file successfully', async () => {
      const file = model.File.build({
        id: 1,
        user_id: 1,
        name: 'test.jpg',
        file_name: 'test.jpg',
        size: 1000,
        mime_type: 'image/jpeg',
        path: 'user/1/test.jpg',
        thumbnail_image: '',
        type: 'image',
        status: 'COMPLETED',
      });
  
      const destroySpy = jest
        .spyOn(file, 'destroy')
        .mockResolvedValue(undefined);
  
      findFileByPrimaryKey.mockResolvedValue(file);
  
  
  
      const result = await deleteFileService({
        fileId: 1,
      });
  
      expect(validateFileId).toHaveBeenCalledWith(1);
  
      expect(findFileByPrimaryKey).toHaveBeenCalledWith(1);
  
      expect(deleteObject).toHaveBeenCalledWith(
        'user/1/test.jpg',
      );
  
      expect(destroySpy).toHaveBeenCalled();
  
      expect(result).toEqual({
        message: expect.any(String),
      });
    });
  });

  describe('initUpload - successful upload', () => {
    it('should initialize video upload successfully', async () => {
      process.env.MINIO_BUCKET = 'test-bucket';
  
      const file = model.File.build({
        id: 1,
        user_id: 1,
        name: 'test.mp4',
        file_name: 'test.mp4',
        size: 0,
        mime_type: 'video/mp4',
        path: '',
        thumbnail_image: '',
        type: 'video',
        status: 'PENDING',
      });
  

      const processing = model.FileProcessing.build({
        id: 10,
        file_id: 1,
        upload_id: 'upload-id-123',
        status: 'INITIATED',
        path: 'user/1/video/1/test.mp4',
      });
      
   
      createFile.mockResolvedValue(file);
  
      generateVIdeo.mockReturnValue(
        'user/1/video/1/test.mp4',
      );
  
      // Mock MinIO multipart upload
      initMultipartUpload.mockResolvedValue(
        'upload-id-123',
      );
  
      createFIleProcessing.mockResolvedValue(processing);

      // Mock database update
      updateFilePath.mockResolvedValue([1]);
  
      // Mock file processing creation
 
      const result = await initUpload({
        userId: 1,
        fileName: 'test.mp4',
        mimeType: 'video/mp4',
      });
  
      expect(createFile).toHaveBeenCalledWith({
        user_id: 1,
        name: 'test.mp4',
        file_name: 'test.mp4',
        size: 0,
        mime_type: 'video/mp4',
        path: '',
        type: 'video',
        status: expect.any(String),
      });
  
      expect(generateVIdeo).toHaveBeenCalledWith(
        1,
        1,
        'test.mp4',
      );
  
      expect(initMultipartUpload).toHaveBeenCalledWith({
        bucket: 'test-bucket',
        key: 'user/1/video/1/test.mp4',
        contentType: 'video/mp4',
      });
  
      expect(updateFilePath).toHaveBeenCalledWith(
        1,
        'user/1/video/1/test.mp4',
      );
  
      expect(createFIleProcessing).toHaveBeenCalledWith({
        file_id: 1,
        upload_id: 'upload-id-123',
        status: 'INITIATED',
        path: 'user/1/video/1/test.mp4',
      });
  
      expect(result).toEqual({
        message: expect.any(String),
        result: {
          fileId: 1,
          processingId: 10,
          objectName: 'user/1/video/1/test.mp4',
        },
      });
    });
  });


  describe('uploadPart', () => {
    it('should upload file part successfully', async () => {
      process.env.MINIO_BUCKET = 'test-bucket';
  
      const fileProcessing = model.FileProcessing.build({
        id: 10,
        file_id: 1,
        upload_id: 'upload-id-123',
        status: 'PENDING',
        path: 'user/1/video/test.mp4',
      });
  
      findUploadId.mockResolvedValue(fileProcessing);
  
      uploadPartMock.mockResolvedValue('etag-123');
  
      updateFileProcessingStatus.mockResolvedValue([1]);
  
      const buffer = Buffer.from('test data');
  
      const result = await uploadPart({
        userId:1,
        fileId:2,
        processingId: 10,
        partNumber: 1,
        buffer,
      });
  
      expect(findUploadId).toHaveBeenCalledWith(10);
  
      expect(uploadPartMock).toHaveBeenCalledWith({
        bucket: 'test-bucket',
        key: 'user/1/video/test.mp4',
        uploadId: 'upload-id-123',
        partNumber: 1,
        body: buffer,
      });
  
      expect(updateFileProcessingStatus).toHaveBeenCalledWith(
        10,
        expect.any(String),
      );
  
      expect(result).toEqual({
        partNumber: 1,
        etag: 'etag-123',
      });
    });
  });


  describe('completeUpload', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should complete upload successfully', async () => {
      process.env.MINIO_BUCKET = 'test-bucket';
  
      const fileProcessing = model.FileProcessing.build({
        id: 10,
        file_id: 1,
        upload_id: 'upload-id-123',
        status: 'PENDING',
        path: 'user/1/video/test.mp4',
      });
  
      findByPk.mockResolvedValue(fileProcessing);
  
      completeMultipartUpload.mockResolvedValue(undefined);
  
      updateFileProcessingStatus.mockResolvedValue([1]);
  
      updateFileStatus.mockResolvedValue([1]);
  
      const result = await completeUpload({
        processingId: 10,
        fileId: 1,
        userId: 1,
        parts: [
          {
            partNumber: 1,
            etag: 'etag-123',
          },
          {
            partNumber: 2,
            etag: 'etag-456',
          },
        ],
      });
  
      expect(findByPk).toHaveBeenCalledWith(10);
  
      expect(completeMultipartUpload).toHaveBeenCalledWith({
        bucket: 'test-bucket',
        key: 'user/1/video/test.mp4',
        uploadId: 'upload-id-123',
        parts: [
          {
            PartNumber: 1,
            ETag: 'etag-123',
          },
          {
            PartNumber: 2,
            ETag: 'etag-456',
          },
        ],
      });
  
      expect(updateFileProcessingStatus).toHaveBeenCalledWith(
        10,
        expect.any(String),
      );
  
      expect(updateFileStatus).toHaveBeenCalledWith(
        1,
        expect.any(String),
      );
  
      expect(publishMessage).toHaveBeenCalledWith(
        expect.any(String),
        {
          type: 'thumbnail',
          fileId: 1,
          userId: 1,
          objectName: 'user/1/video/test.mp4',
        },
      );
  
      expect(result).toEqual({
        message: expect.any(String),
        status: expect.any(String),
      });
    });
  });

  
  describe('downloadVideo', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return video download URL successfully', async () => {
      const file = model.File.build({
        id: 1,
        user_id: 1,
        name: 'test.mp4',
        file_name: 'test.mp4',
        size: 1000,
        mime_type: 'video/mp4',
        path: 'user/1/video/test.mp4',
        thumbnail_image: '',
        type: 'video',
        status: 'COMPLETED',
      });
  
      const qualityRow = model.VideoQuality.build({
        id: 1,
        file_id: 1,
        low_quality_path: 'video/360p.mp4',
        medium_quality_path: 'video/480p.mp4',
        high_quality_path: 'video/720p.mp4',
        hd_quality_path: 'video/1080p.mp4',
      });
  
      findFileByPrimaryKey.mockResolvedValue(file);
  
      findVideoQuality.mockResolvedValue(qualityRow);
  
      getObjectUrl.mockResolvedValue(
        'https://minio/video/720p.mp4',
      );
  
      const result = await downloadVideo({
        fileId: 1,
        userId: 1,
        quality: '720p',
      });
  
      expect(findFileByPrimaryKey).toHaveBeenCalledWith(1);
  
      expect(findVideoQuality).toHaveBeenCalledWith(1);
  
      expect(getObjectUrl).toHaveBeenCalledWith(
        'video/720p.mp4',
        '720p',
      );
  
      expect(result).toEqual({
        message: expect.any(String),
        status: expect.any(String),
        url: 'https://minio/video/720p.mp4',
      });
  
      expect(publishMessage).not.toHaveBeenCalled();
  
      expect(updateFileStatus).not.toHaveBeenCalled();
    });
  });