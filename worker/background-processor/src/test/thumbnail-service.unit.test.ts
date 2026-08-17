import {jest,describe, beforeEach, it,expect} from '@jest/globals';
import { PassThrough } from 'stream';

import repository from '@dam/database/repositories';
import serviceStorage from '@dam/shared/storage';
import FILE_CONSTANTS from '@dam/shared/constants';


const getObject = jest.fn() as jest.MockedFunction<
  typeof serviceStorage.storageService.getObject
>;

const upload = jest.fn() as jest.MockedFunction<
  typeof serviceStorage.storageService.upload
>;

const updateFileThumbnailImage =
  jest.fn() as jest.MockedFunction<
    typeof repository.fileRepository.updateFileThumbnailImage
  >;

const updateFileStatus = jest.fn() as jest.MockedFunction<
  typeof repository.fileRepository.updateFileStatus
>;

const generateImageThumbnail = jest.fn();

const resize = jest.fn();
const jpeg = jest.fn();

const sharpMock = jest.fn();

jest.unstable_mockModule('@dam/database/repositories', () => ({
  default: {
    fileRepository: {
      updateFileThumbnailImage,
      updateFileStatus,
    },
  },
}));

jest.unstable_mockModule('@dam/shared/storage', () => ({
  default: {
    storageService: {
      getObject,
      upload,
    },
  },
}));

jest.unstable_mockModule('../logger/index', () => ({
  default: {
    workerLogger: {
      generateImageThumbnail,
    },
  },
}));

jest.unstable_mockModule('sharp', () => ({
  default: sharpMock,
}));

const { default: imageService } =
  await import('../../../background-processor/src/service/thumbnail-service.js');

describe('Image Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    resize.mockReturnValue({
      jpeg,
    });

    jpeg.mockReturnValue(new PassThrough());

    sharpMock.mockReturnValue({
      resize,
    });

    const uploadResult = {
        objectName: "object name",
        originalName: "string",
        mimeType: "image/jpg",
        size: 1,
        etag: 'e12344',
        url: 'url',
      }

    upload.mockResolvedValue(uploadResult);
    updateFileThumbnailImage.mockResolvedValue([1]);
    updateFileStatus.mockResolvedValue([1]);
  });

  describe('processImageThumbnail', () => {
    const payload = {
      fileId: 1,
      userId: 1,
      objectName: 'images/test.jpg',
      mimeType: 'image/jpeg',
    } 

    it('should process image thumbnail successfully', async () => {
      const imageStream = new PassThrough();

      getObject.mockResolvedValue(imageStream as any);

      await imageService.processImageThumbnail(payload);

      expect(getObject).toHaveBeenCalledWith('images/test.jpg');

      expect(sharpMock).toHaveBeenCalled();

      expect(resize).toHaveBeenCalledWith({
        width: 300,
        height: 300,
        fit: 'inside',
      });

      expect(jpeg).toHaveBeenCalledWith({
        quality: 80,
      });

      expect(upload).toHaveBeenCalledWith(
        'thumbnails/images/1/test.jpg',
        expect.anything(),
        'image/jpeg',
      );

      expect(updateFileThumbnailImage).toHaveBeenCalledWith(
        1,
        'thumbnails/images/1/test.jpg',
      );

      expect(updateFileStatus).toHaveBeenCalledWith(
        1,
        FILE_CONSTANTS.MESSAGES.FILE_STATUS.COMPLETED,
      );

      expect(generateImageThumbnail).toHaveBeenCalledWith(
        'thumbnails/images/1/test.jpg',
      );
    });

    it('should mark file as failed when getting the image fails', async () => {
      const error = new Error('MinIO connection failed');

      getObject.mockRejectedValue(error);

      await expect(
        imageService.processImageThumbnail(payload),
      ).rejects.toThrow('MinIO connection failed');

      expect(updateFileStatus).toHaveBeenCalledWith(
        1,
        FILE_CONSTANTS.MESSAGES.FILE_STATUS.FAILED,
      );

      expect(upload).not.toHaveBeenCalled();
      expect(updateFileThumbnailImage).not.toHaveBeenCalled();
      expect(generateImageThumbnail).not.toHaveBeenCalled();
    });

    it('should mark file as failed when thumbnail upload fails', async () => {
      const imageStream = new PassThrough();
      const error = new Error('Thumbnail upload failed');

      getObject.mockResolvedValue(imageStream as any);
      upload.mockRejectedValue(error);

      await expect(
        imageService.processImageThumbnail(payload),
      ).rejects.toThrow('Thumbnail upload failed');

      expect(upload).toHaveBeenCalledWith(
        'thumbnails/images/1/test.jpg',
        expect.anything(),
        'image/jpeg',
      );

      expect(updateFileStatus).toHaveBeenCalledWith(
        1,
        FILE_CONSTANTS.MESSAGES.FILE_STATUS.FAILED,
      );

      expect(updateFileThumbnailImage).not.toHaveBeenCalled();
      expect(generateImageThumbnail).not.toHaveBeenCalled();
    });

    it('should mark file as failed when updating thumbnail path fails', async () => {
      const imageStream = new PassThrough();
      const error = new Error('Database update failed');

      getObject.mockResolvedValue(imageStream as any);
      updateFileThumbnailImage.mockRejectedValue(error);

      await expect(
        imageService.processImageThumbnail(payload),
      ).rejects.toThrow('Database update failed');

      expect(updateFileThumbnailImage).toHaveBeenCalledWith(
        1,
        'thumbnails/images/1/test.jpg',
      );

      expect(updateFileStatus).toHaveBeenCalledWith(
        1,
        FILE_CONSTANTS.MESSAGES.FILE_STATUS.FAILED,
      );

      expect(generateImageThumbnail).not.toHaveBeenCalled();
    });

    it('should mark file as failed when updating completed status fails', async () => {
        const imageStream = new PassThrough();
        const error = new Error('Status update failed');
      
        getObject.mockResolvedValue(imageStream as any);
      
        updateFileStatus
          .mockRejectedValueOnce(error)
          .mockResolvedValueOnce([1]);
      
        await expect(
          imageService.processImageThumbnail(payload),
        ).rejects.toThrow('Status update failed');
      
        expect(updateFileStatus).toHaveBeenNthCalledWith(
          1,
          1,
          FILE_CONSTANTS.MESSAGES.FILE_STATUS.COMPLETED,
        );
      
        expect(updateFileStatus).toHaveBeenNthCalledWith(
          2,
          1,
          FILE_CONSTANTS.MESSAGES.FILE_STATUS.FAILED,
        );
      });
  });
});