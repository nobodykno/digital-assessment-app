import FILE_CONSTANTS from '@dam/shared/constants'
import logger from '../logger/index.js';

import { AppError } from './app-error.js';

import type cors from 'cors';

/**
 * Checks all allowedOrigins
 */
const allowedOrigins = process.env.CORS_ORIGIN?.split(',') ?? [];

console.log(process.env)
const corsOptions: cors.CorsOptions = {
  origin(origin, callback) {
    // Allow Postman and server-to-server requests
    if (!origin) {
      return callback(null, true);
    }



    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    logger.logError({
      module: FILE_CONSTANTS.MESSAGES.MODULE.AUTH_ERROR,
      action: FILE_CONSTANTS.MESSAGES.ACTION.CORS_ISSUE,
      message: FILE_CONSTANTS.MESSAGES.CORS.CORS_ERROR,
    });

    callback(
      new AppError(FILE_CONSTANTS.MESSAGES.CORS.CORS_ERROR, FILE_CONSTANTS.HTTP_STATUS.BAD_REQUEST),
    );
  },

  credentials: true,
};

export default corsOptions;
