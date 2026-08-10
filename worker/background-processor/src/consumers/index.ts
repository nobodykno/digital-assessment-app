import startImageConsumer from "./image-consumers.js";
import startVideoWorker from "./video-consumer.js";

const start = async (): Promise<void> => {
  const workerType = process.env.WORKER_TYPE;

  switch (workerType) {
    case "image":
      await startImageConsumer();
      break;

    case "video":
      await startVideoWorker();
      break;

    default:
      throw new Error(
        `Invalid WORKER_TYPE: ${workerType}`,
      );
  }
};

export default {
  start,
};