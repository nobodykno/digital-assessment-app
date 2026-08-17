import '../config/env.js'
import rabbitmq from "@dam/shared/rabbitmq";
import workerService from '../service/index.js';


const startImageWorker = async (): Promise<void> => {
  await rabbitmq.rabbitmqService.connectRabbitMQ(rabbitmq.rabbitMQQueues.image);
  await rabbitmq.rabbitmqService.consumeMessage(rabbitmq.rabbitMQQueues.image, workerService.imageService.processImageThumbnail);
};


export default startImageWorker;

