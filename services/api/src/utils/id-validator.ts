import FILE_CONSTANTS from '@dam/shared/constants'
import { AppError } from '../middleware/app-error.js';

/**
 * Ensures a file ID is provided.
 */

const validateFileId = (fileId?: number): void => {
  if (!fileId) {
    throw new AppError(FILE_CONSTANTS.MESSAGES.FILE.FILE_ID_NOT_FOUND, 400);
  }
};

/**
 * Ensures a file ID is provided.
 */

const validateUserId = (fileId?: number): void => {
  if (!fileId) {
    throw new AppError(FILE_CONSTANTS.MESSAGES.AUTH.USER_NOT_FOUND, 400);
  }
};

const idValidators = {
  validateFileId,
  validateUserId,
};

export default idValidators;
