import validateEnv from '../config/validate-env.js';

import authToken from './auth-token.js';
import corsOptions from './cors.js';
import globalErrorHandler from './global-error.js';
import morganMiddleware from './morgan.js';
import globalRateLimiter from './rate-limiter.js';
import logSuccess from './success-logger.js';
import { uploadMiddleware } from './uploader.js';
import authenticateUser from './user-owner.js';
import validate from './validate.js';

const middleware = {
  globalErrorHandler,
  globalRateLimiter,
  logSuccess,
  validate,
  morganMiddleware,
  corsOptions,
  validateEnv,
  authToken,
  authenticateUser,
  uploadMiddleware,
};

export default middleware;
