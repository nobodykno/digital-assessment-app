import authLogger from './auth-logger.js';
import logError from './error-logger.js';
import fileLogger from './file-logger.js';
import rabbitLogger from './rabbit-logger.js';
import workerLogger from './worker-logger.js';

const logger = {
  fileLogger,
  authLogger,
  logError,
  rabbitLogger,
  workerLogger,
};

export default logger;
