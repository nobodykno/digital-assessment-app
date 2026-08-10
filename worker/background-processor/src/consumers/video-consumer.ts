
import '../config/env.js';
import shared from '@dam/shared';
import { IVideoProcessingJob } from '../dto/video-processing-dto.js';
import workerService from '../service/index.js';

/**
 * Starts the video processing worker.
 */
const startVideoWorker = async (): Promise<void> => {
  await shared.rabbitmq.rabbitmqService.connectRabbitMQ(shared.rabbitmq.rabbitMQQueues.video);
  await shared.rabbitmq.rabbitmqService.consumeMessage<IVideoProcessingJob>(shared.rabbitmq.rabbitMQQueues.video, async (job) => {
    switch (job.type) {
      case 'thumbnail':
        await workerService.videoThumbnailService.generateThumbnail(job);
        break;

      case 'quality':
        await workerService.videoQualityService.generateVideoQuality(job);
        break;

      default:
        throw Error(
          shared.FILE_CONSTANTS.MESSAGES.WORKER.UNKNOWN_JOB
        );
    }
  });
};


export default startVideoWorker;;
