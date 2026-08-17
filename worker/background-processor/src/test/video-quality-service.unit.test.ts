import {
    beforeEach,
    describe,
    expect,
    it,
    jest,
  } from '@jest/globals';
  import { PassThrough } from 'node:stream';
  import type { ChildProcess } from 'node:child_process';
  
  import repository from '@dam/database/repositories';
  import serviceStorage from '@dam/shared/storage';
  import shared from '@dam/shared';

  
  import model from '@dam/database';
  
  import type { IVideoProcessingJob } from '../dto/video-processing-dto.js';
  

  import crypto from 'node:crypto';
  
  
  const getObject = jest.fn() as jest.MockedFunction<
    typeof serviceStorage.storageService.getObject
  >;

  const pipelineMock = jest.fn<
  (
    source: NodeJS.ReadableStream,
    destination: NodeJS.WritableStream,
  ) => Promise<void>
>();
  
  const upload = jest.fn() as jest.MockedFunction<
    typeof serviceStorage.storageService.upload
  >;
  
  const updateVideoQuality = jest.fn() as jest.MockedFunction<
    typeof repository.videoQualityRepository.updateVideoQuality
  >;
  
  const createVideoQuality = jest.fn() as jest.MockedFunction<
    typeof repository.videoQualityRepository.createVideoQuality
  >;
  
  const updateFileStatus = jest.fn() as jest.MockedFunction<
    typeof repository.fileRepository.updateFileStatus
  >;
  
  const logError = jest.fn();
  
  const generateVideoQualityLog = jest.fn();
  
  const removeTempFIles = jest.fn();
  
  const unlinkMock = jest.fn<
  (path: string) => Promise<void>
>();

  const spawnMock = jest.fn();
  
  const randomUUID = jest.fn() as jest.MockedFunction<
    typeof crypto.randomUUID
  >;
  

  jest.unstable_mockModule('@dam/database/repositories', () => ({
    default: {
      videoQualityRepository: {
        updateVideoQuality,
        createVideoQuality,
      },
      fileRepository: {
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
  
  jest.unstable_mockModule('@dam/shared/logs', () => ({
    default: {
      logError,
    },
  }));
  
  jest.unstable_mockModule('../logger/index.js', () => ({
    default: {
      workerLogger: {
        generateVideoQuality: generateVideoQualityLog,
        removeTempFIles,
      },
    },
  }));
  
  jest.unstable_mockModule('node:stream/promises', () => ({
    pipeline: pipelineMock,
  }));
  
  jest.unstable_mockModule('node:fs/promises', () => ({
    unlink: unlinkMock,
  }));
  
  jest.unstable_mockModule('node:crypto', () => ({
    default: {
      randomUUID,
    },
  }));
  
  jest.unstable_mockModule('node:child_process', () => ({
    spawn: spawnMock,
  }));

  const createReadStream = jest.fn(
    () => new PassThrough(),
  );
  
  const createWriteStream = jest.fn(
    () => new PassThrough(),
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

  
  const { default: videoQualityService } =
    await import('../service/video-quality-service.js');
  
  describe('Video Quality Service', () => {
    const payload = {
      fileId: 1,
      userId: 10,
      objectName: 'videos/test.mp4',
      quality: '720p',
    };
  
    beforeEach(() => {
      jest.clearAllMocks();
  
      randomUUID.mockReturnValue(
        '00000000-0000-0000-0000-000000000001',
      );
  
      getObject.mockResolvedValue(
        new PassThrough(),
      );
  
      pipelineMock.mockResolvedValue(undefined);
  
      unlinkMock.mockResolvedValue(undefined);
  
      updateVideoQuality.mockResolvedValue([1]);
  
      updateFileStatus.mockResolvedValue([1]);
  
      const uploadResult = {
        objectName: "object name",
        originalName: "string",
        mimeType: "image/jpg",
        size: 1,
        etag: 'e12344',
        url: 'url',
      }
  
      upload.mockResolvedValue(uploadResult);
  
      createVideoQuality.mockResolvedValue(
        model.model.VideoQuality.build({
          file_id: 1,
          hd_quality_path: '',
          high_quality_path: '',
          medium_quality_path: '',
          low_quality_path: '',
        }),
      );
  
      generateVideoQualityLog.mockImplementation(
        () => undefined,
      );
  
      removeTempFIles.mockImplementation(
        () => undefined,
      );
  
      logError.mockImplementation(
        () => undefined,
      );
    });
  
    describe('generateVideoQuality', () => {
      it('should throw an error when quality is missing', async () => {
        const invalidPayload: IVideoProcessingJob = {
            type: 'thumbnail',
  
            fileId: 1,
            userId: 2,
          
            objectName: 'objectName',
          
            quality: undefined 
        };
  
        await expect(
          videoQualityService.generateVideoQuality(
            invalidPayload,
          ),
        ).rejects.toThrow(
          shared.FILE_CONSTANTS.MESSAGES.WORKER
            .VIDEO_QUALITY_MISSING,
        );
  
        expect(logError).toHaveBeenCalled();
  
        expect(getObject).not.toHaveBeenCalled();
  
        expect(upload).not.toHaveBeenCalled();
  
        expect(updateVideoQuality).not.toHaveBeenCalled();
  
        expect(createVideoQuality).not.toHaveBeenCalled();
      });
  
      it('should generate, upload and update video quality successfully', async () => {
        const ffmpeg = {
          stdout: {
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
      

        const payload: IVideoProcessingJob = {
            type: 'thumbnail',
  
            fileId: 1,
            userId: 2,
          
            objectName: 'objectName',
          
            quality: '720p' 
        };
        await videoQualityService.generateVideoQuality(payload);
      
        expect(spawnMock).toHaveBeenCalledWith(
          'ffmpeg',
          expect.any(Array),
        );
      
        expect(upload).toHaveBeenCalled();
      
        expect(updateVideoQuality).toHaveBeenCalled();
      
        expect(updateFileStatus).toHaveBeenCalledWith(
          1,
          shared.FILE_CONSTANTS.MESSAGES.FILE_STATUS.COMPLETED,
        );
      });
  
      it('should create a video quality record when update affects no rows', async () => {
        const ffmpeg = {
            stdout: {
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
  
        spawnMock.mockReturnValue(ffmpeg);
  
        updateVideoQuality.mockResolvedValue([0]);

        const payload: IVideoProcessingJob = {
            type: 'thumbnail',
            fileId: 1,
            userId: 2,
            objectName: 'objectName',
            quality: '720p',
          };
        await videoQualityService.generateVideoQuality(
            payload,
        );
  
        expect(updateVideoQuality).toHaveBeenCalled();
  
        expect(createVideoQuality).toHaveBeenCalledWith({
            file_id: 1,
            hd_quality_path: '',
            high_quality_path: expect.stringContaining(
              'users/2/videos/1/720p/',
            ),
            medium_quality_path: '',
            low_quality_path: '',
          });
  
        expect(updateFileStatus).toHaveBeenCalledWith(
          1,
          shared.FILE_CONSTANTS.MESSAGES.FILE_STATUS
            .COMPLETED,
        );
      });
  
  
      it('should remove temporary files after processing', async () => {
        const ffmpeg = {
            stdout: {
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
  
        spawnMock.mockReturnValue(ffmpeg);

        const payload: IVideoProcessingJob = {
            fileId: 1,
            userId: 2,
            objectName: 'objectName',
            quality: "360p",
            type: 'quality',
            
        }
  
        await videoQualityService.generateVideoQuality(
          payload,
        );
  
        expect(unlinkMock).toHaveBeenCalled();
      });
    });
  });