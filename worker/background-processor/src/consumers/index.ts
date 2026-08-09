import startImageConsumer from "./image-consumers.js";


const start = async (): Promise<void> => {
  await startImageConsumer();
};

export default {
  start,
};