import FILE_CONSTANTS from '@dam/shared/constants'
import logger from '../logger/index.js';
import model from '../models/index.js';

import { AppError } from './app-error.js';

import type { NextFunction, Response } from 'express';
import type { Request } from 'express';

/**
 *
 * @param req
 * @param _res
 * @param next
 * Check's the user ownership if user belongs to particular file
 */

const authenticateUser = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const file_id = Number(req.params.fileId);

    if (!file_id) {
      logger.logError({
        module: FILE_CONSTANTS.MESSAGES.MODULE.USER_OWNER,
        action: FILE_CONSTANTS.MESSAGES.ACTION.USER_OWNER_ERROR,
        message: FILE_CONSTANTS.MESSAGES.FILE.FILE_ID_NOT_FOUND,
      });

      return next(
        new AppError(
          FILE_CONSTANTS.MESSAGES.FILE.FILE_ID_NOT_FOUND,
          FILE_CONSTANTS.HTTP_STATUS.NOT_FOUND,
        ),
      );
    }

    const user = req.user;

    if (!user) {
      logger.logError({
        module: FILE_CONSTANTS.MESSAGES.MODULE.USER_OWNER,
        action: FILE_CONSTANTS.MESSAGES.ACTION.USER_OWNER_ERROR,
        message: FILE_CONSTANTS.MESSAGES.AUTH.INVALID_TOKEN,
      });
      return next(
        new AppError(
          FILE_CONSTANTS.MESSAGES.AUTH.INVALID_TOKEN,
          FILE_CONSTANTS.HTTP_STATUS.UNAUTHORIZED,
        ),
      );
    }

    const fileData = await model.File.findOne({
      where: {
        id: file_id,
        user_id: req.user?.id,
      },
    });

    if (!fileData) {
      logger.logError({
        module: FILE_CONSTANTS.MESSAGES.MODULE.USER_OWNER,
        action: FILE_CONSTANTS.MESSAGES.ACTION.USER_OWNER_ERROR,
        message: FILE_CONSTANTS.MESSAGES.AUTH.INVALID_TOKEN,
      });

      return next(
        new AppError(
          FILE_CONSTANTS.MESSAGES.FILE.INVALID_FILE,
          FILE_CONSTANTS.HTTP_STATUS.NOT_FOUND,
        ),
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default authenticateUser;
