import {
    beforeEach,
    describe,
    expect,
    it,
    jest,
  } from '@jest/globals';
  
  import { PassThrough } from 'node:stream';
  import type { ChildProcess } from 'node:child_process';
  import crypto from 'node:crypto';
  
  import serviceStorage from '@dam/shared/storage';
  import repository from '@dam/database/repositories';
  import shared from '@dam/shared';
  
  import type { IWorkerDTOJob } from '../dto/worker-dto.js';

  
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
  
  const unlinkMock = jest.fn<
    (path: string) => Promise<void>
  >();
  
  const pipelineMock = jest.fn<
    (
      source: NodeJS.ReadableStream,
      destination: NodeJS.WritableStream,
    ) => Promise<void>
  >();
  
  const spawnMock = jest.fn();
  
  const randomUUID = jest.fn() as jest.MockedFunction<
    typeof crypto.randomUUID
  >;
  
  const logError = jest.fn();
  
  const generateVideoThumbnail = jest.fn();
  
  const removeTempFIles = jest.fn();
  
  const createReadStream = jest.fn(
    () => new PassThrough(),
  );
  
  const createWriteStream = jest.fn(
    () => new PassThrough(),
  );
  

  
  jest.unstable_mockModule(
    '@dam/shared/storage',
    () => ({
      default: {
        storageService: {
          getObject,
          upload,
        },
      },
    }),
  );
  
  jest.unstable_mockModule(
    '@dam/database/repositories',
    () => ({
      default: {
        fileRepository: {
          updateFileThumbnailImage,
          updateFileStatus,
        },
      },
    }),
  );
  
  jest.unstable_mockModule(
    '@dam/shared/logs',
    () => ({
      default: {
        logError,
      },
    }),
  );
  
  jest.unstable_mockModule(
    '../logger/index.js',
    () => ({
      default: {
        workerLogger: {
          generateVideoThumbnail,
          removeTempFIles,
        },
      },
    }),
  );
  
  jest.unstable_mockModule(
    'node:fs',
    () => ({
      default: {
        createReadStream,
        createWriteStream,
      },
    }),
  );
  
  jest.unstable_mockModule(
    'node:fs/promises',
    () => ({
      unlink: unlinkMock,
    }),
  );
  
  jest.unstable_mockModule(
    'node:stream/promises',
    () => ({
      pipeline: pipelineMock,
    }),
  );
  
  jest.unstable_mockModule(
    'node:child_process',
    () => ({
      spawn: spawnMock,
    }),
  );
  
  jest.unstable_mockModule(
    'node:crypto',
    () => ({
      default: {
        randomUUID,
      },
    }),
  );
  

  
  const {
    default: videoThumbnailService,
    createThumbnail,
  } = await import(
    '../service/video-thumbnail-service.js'
  );
  

  
  describe('Video Thumbnail Service', () => {
    const payload = {
      fileId: 1,
      userId: 2,
      objectName: 'videos/test.mp4',
      mimeType: 'video/mp4',
    };
  
    beforeEach(() => {
      jest.clearAllMocks();
  
      randomUUID.mockReturnValue(
        '00000000-0000-0000-0000-000000000001',
      );
  
      getObject.mockResolvedValue(
        new PassThrough(),
      );
  
      upload.mockResolvedValue({
        objectName: 'thumbnail.jpg',
        originalName: 'thumbnail.jpg',
        mimeType: 'image/jpeg',
        size: 100,
        etag: 'etag',
        url: 'url',
      });
  
      updateFileThumbnailImage.mockResolvedValue([1]);
  
      updateFileStatus.mockResolvedValue([1]);
  
      pipelineMock.mockResolvedValue(undefined);
  
      unlinkMock.mockResolvedValue(undefined);
  
      createReadStream.mockReturnValue(
        new PassThrough(),
      );
  
      createWriteStream.mockReturnValue(
        new PassThrough(),
      );
  
      generateVideoThumbnail.mockImplementation(
        () => undefined,
      );
  
      removeTempFIles.mockImplementation(
        () => undefined,
      );
  
      logError.mockImplementation(
        () => undefined,
      );
    });
  

  
    describe('createThumbnail', () => {
      it('should create thumbnail successfully', async () => {
        const ffmpeg = {
          stdout: {
            on: jest.fn(),
          },
  
          stderr: {
            on: jest.fn(),
          },
  
          on: jest.fn(
            (
              event: string,
              callback: (code: number) => void,
            ) => {
              if (event === 'close') {
                callback(0);
              }
  
              return ffmpeg;
            },
          ),
  
          kill: jest.fn(),
        };
  
        spawnMock.mockReturnValue(
          ffmpeg as unknown as ChildProcess,
        );
  
        const result = await createThumbnail(
          '/tmp/video.mp4',
        );
  
        expect(spawnMock).toHaveBeenCalledWith(
          'ffmpeg',
          expect.arrayContaining([
            '-y',
            '-ss',
            '00:00:03',
            '-i',
            '/tmp/video.mp4',
            '-frames:v',
            '1',
            '-vf',
            'scale=300:-1',
            '-q:v',
            '2',
          ]),
        );
  
        expect(result).toContain('.jpg');
      });
  
      it('should throw when FFmpeg fails', async () => {
        const ffmpeg = {
          stdout: {
            on: jest.fn(),
          },
  
          stderr: {
            on: jest.fn(),
          },
  
          on: jest.fn(
            (
              event: string,
              callback: (code: number) => void,
            ) => {
              if (event === 'close') {
                callback(1);
              }
  
              return ffmpeg;
            },
          ),
  
          kill: jest.fn(),
        };
  
        spawnMock.mockReturnValue(
          ffmpeg as unknown as ChildProcess,
        );
  
        await expect(
          createThumbnail('/tmp/video.mp4'),
        ).rejects.toThrow(
          'FFmpeg exited with code 1',
        );
      });
    });
  

  
    describe('generateThumbnail', () => {
      it('should generate, upload and update thumbnail successfully', async () => {
        const ffmpeg = {
          stdout: {
            on: jest.fn(),
          },
  
          stderr: {
            on: jest.fn(),
          },
  
          on: jest.fn(
            (
              event: string,
              callback: (code: number) => void,
            ) => {
              if (event === 'close') {
                callback(0);
              }
  
              return ffmpeg;
            },
          ),
  
          kill: jest.fn(),
        };
  
        spawnMock.mockReturnValue(
          ffmpeg as unknown as ChildProcess,
        );
  
        const result =
          await videoThumbnailService.generateThumbnail(
            payload,
          );
  
        expect(getObject).toHaveBeenCalledWith(
          'videos/test.mp4',
        );
  
        expect(pipelineMock).toHaveBeenCalled();
  
        expect(upload).toHaveBeenCalledWith(
          expect.stringContaining(
            'users/2/images/1/thumbnails/video/',
          ),
          expect.anything(),
          'image/jpeg',
        );
  
        expect(
          updateFileThumbnailImage,
        ).toHaveBeenCalledWith(
          1,
          expect.stringContaining(
            'users/2/images/1/thumbnails/video/',
          ),
        );
  
        expect(updateFileStatus).toHaveBeenCalledWith(
          1,
          shared.FILE_CONSTANTS.MESSAGES.FILE_STATUS
            .COMPLETED,
        );
  
        expect(
          generateVideoThumbnail,
        ).toHaveBeenCalled();
  
        expect(unlinkMock).toHaveBeenCalledTimes(2);
  
        expect(result).toContain('.jpg');
      });
  
      it('should throw and log error when video download fails', async () => {
        const error = new Error(
          'Video download failed',
        );
  
        getObject.mockRejectedValue(error);
  
        await expect(
          videoThumbnailService.generateThumbnail(
            payload,
          ),
        ).rejects.toThrow(
          'Video download failed',
        );
  
        expect(logError).toHaveBeenCalled();
  
        expect(upload).not.toHaveBeenCalled();
  
        expect(
          updateFileThumbnailImage,
        ).not.toHaveBeenCalled();
  
        expect(updateFileStatus).not.toHaveBeenCalled();
      });
    });
  });