import FILE_CONSTANTS from '@dam/shared/constants'
import logger from '../logger/index.js';

import { AppError } from './app-error.js';

import type { ErrorRequestHandler } from 'express';

/**
 * Global error handling middleware.
 *
 *
 * @param err - The error thrown by the application.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 * @returns A JSON response containing the error message.
 */
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  void next;


  const error = err instanceof Error
    ? err
    : new Error('Unknown error');

  logger.logError({
    action: FILE_CONSTANTS.MESSAGES.ACTION.UNHANDLED_ERROR,
    module: FILE_CONSTANTS.MESSAGES.MODULE.GLOBAL_ERROR,
    message: error.message,
    errorName: error.name,
    stack: error.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    data: err,
  });
  console.error("err",err)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });

  
  }


  return res.status(FILE_CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: error.message,
  });
};

export default globalErrorHandler;
