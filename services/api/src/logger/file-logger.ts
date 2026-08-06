import FILE_CONSTANTS from '@dam/shared/constants'
import middleware from '../middleware/index.js';

const fileLogger = {
  /**
   * Logs success when file are uploaded
   * @param user_id
   * @param totalFiles
   *
   */

  uploaded(user_id: number) {
    middleware.logSuccess({
      module: FILE_CONSTANTS.MESSAGES.MODULE.FILE,
      action: FILE_CONSTANTS.MESSAGES.ACTION.UPLOAD,
      message: FILE_CONSTANTS.MESSAGES.FILE.UPLOAD_SUCCESS,
      data: {
        user_id
      },
    });
  },

  /**
   * Logs success init upload operation
   * @param user_id
   * @param fileId
   */

  initUpload(user_id: number, fileId: number) {
    middleware.logSuccess({
      module: FILE_CONSTANTS.MESSAGES.MODULE.FILE,
      action: FILE_CONSTANTS.MESSAGES.ACTION.UPLOAD,
      message: FILE_CONSTANTS.MESSAGES.FILE.FILE_UPLOAD_INITIATE_SUCCESS,
      data: {
        user_id,
        fileId,
      },
    });
  },

  /**
   * Logs success when part upload completes
   * @param user_id
   * @param fileId
   */

  completePartUpload(user_id: number, fileId: number) {
    middleware.logSuccess({
      module: FILE_CONSTANTS.MESSAGES.MODULE.FILE,
      action: FILE_CONSTANTS.MESSAGES.ACTION.UPLOAD,
      message: FILE_CONSTANTS.MESSAGES.FILE.FILE_PART_SUCCESS,
      data: {
        user_id,
        fileId,
      },
    });
  },

  /**
   * Logs success when file is deleted
   * @param fileId
   */

  deleted(fileId: number) {
    middleware.logSuccess({
      module: FILE_CONSTANTS.MESSAGES.MODULE.FILE,
      action: FILE_CONSTANTS.MESSAGES.ACTION.CREATE,
      message: FILE_CONSTANTS.MESSAGES.FILE.DELETE_SUCCESS,
      data: {
        fileId,
      },
    });
  },
  /**
   * Logs success when all files are fetched
   * @param userId
   * @param count
   */
  fetched(userId: number, count: number) {
    middleware.logSuccess({
      module: FILE_CONSTANTS.MESSAGES.MODULE.FILE,
      action: FILE_CONSTANTS.MESSAGES.ACTION.GET,
      message: FILE_CONSTANTS.MESSAGES.FILE.FETCH_SUCCESS,
      data: {
        userId,
        totalFiles: count,
      },
    });
  },

  fetchedFileCount(userId: number) {
    middleware.logSuccess({
      module: FILE_CONSTANTS.MESSAGES.MODULE.FILE,
      action: FILE_CONSTANTS.MESSAGES.ACTION.GET,
      message: FILE_CONSTANTS.MESSAGES.FILE.FETCH_SUCCESS_COUNT,
      data: {
        userId,
      },
    });
  },
};

export default fileLogger;
