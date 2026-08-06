import jwt from 'jsonwebtoken';

import FILE_CONSTANTS from '@dam/shared/constants'
import logger from '../logger/index.js';

import { AppError } from './app-error.js';

import type { IJwtPayload } from '../dto/request/auth-request-dto.js';
import type { NextFunction, RequestHandler, Response } from 'express';
import type { Request } from 'express';

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns Global user ID is accessible through `userId`.
 */

const authToken: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    logger.logError({
      module: FILE_CONSTANTS.MESSAGES.MODULE.AUTH_ERROR,
      action: FILE_CONSTANTS.MESSAGES.ACTION.TOKEN_MISSING_ERROR,
      message: FILE_CONSTANTS.MESSAGES.AUTH.TOKEN_NOT_FOUND,
    });

    return next(
      new AppError(
        FILE_CONSTANTS.MESSAGES.AUTH.TOKEN_NOT_FOUND,
        FILE_CONSTANTS.HTTP_STATUS.UNAUTHORIZED,
      ),
    );
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as IJwtPayload;
    if (typeof decoded === 'string') {
      logger.logError({
        module: FILE_CONSTANTS.MESSAGES.MODULE.AUTH_ERROR,
        action: FILE_CONSTANTS.MESSAGES.ACTION.TOKEN_MISSING_ERROR,
        message: FILE_CONSTANTS.MESSAGES.AUTH.INVALID_TOKEN,
      });

      return next(
        new AppError(
          FILE_CONSTANTS.MESSAGES.AUTH.INVALID_TOKEN,
          FILE_CONSTANTS.HTTP_STATUS.UNAUTHORIZED,
        ),
      );
    }

    req.user = decoded;

    next();
  } catch {
    logger.logError({
      module: FILE_CONSTANTS.MESSAGES.MODULE.CORS_ERROR,
      action: FILE_CONSTANTS.MESSAGES.ACTION.TOKEN_MISSING_ERROR,
      message: FILE_CONSTANTS.MESSAGES.AUTH.INVALID_TOKEN,
    });

    next(
      new AppError(
        FILE_CONSTANTS.MESSAGES.AUTH.INVALID_TOKEN,
        FILE_CONSTANTS.HTTP_STATUS.UNAUTHORIZED,
      ),
    );
  }
};

export default authToken;
