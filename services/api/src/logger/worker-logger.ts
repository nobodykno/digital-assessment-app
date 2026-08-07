import FILE_CONSTANTS from '@dam/shared/constants'
import logSuccess from '../middleware/success-logger.js';


const workerLogger = {
  /**
   * Logs success when generate video thumbnail
   * @param url
   *
   */

  generateVideoThumbnail(url: string) {
   logSuccess({
      module: FILE_CONSTANTS.MESSAGES.MODULE.VIDEO_WORKER,
      action: FILE_CONSTANTS.MESSAGES.ACTION.GENERATE_VIDEO_THUMBNAIL,
      message: FILE_CONSTANTS.MESSAGES.WORKER.GENERATE_THUMBNAIL_VIDEO_SUCCESS,
      data: {
        url,
      },
    });
  },

  /**
   * Logs success when generate image thumbnail
   * @param url
   *
   */

  generateImageThumbnail(url: string) {
   logSuccess({
      module: FILE_CONSTANTS.MESSAGES.MODULE.IMAGE_WORKER,
      action: FILE_CONSTANTS.MESSAGES.ACTION.GENERATE_IMAGE_THUMBNAIL,
      message: FILE_CONSTANTS.MESSAGES.WORKER.GENERATE_THUMBNAIL_IMAGE_SUCCESS,
      data: {
        url,
      },
    });
  },

  /**
   * Logs success when generate video quality
   * @param url
   *
   */

  generateVideoQuality(quality: string) {
   logSuccess({
      module: FILE_CONSTANTS.MESSAGES.MODULE.VIDEO_WORKER,
      action: FILE_CONSTANTS.MESSAGES.ACTION.GENERATE_VIDEO_QUALITY,
      message: FILE_CONSTANTS.MESSAGES.WORKER.GENERATE_VIDEO_QUALITY_SUCCESS,
      data: {
        quality,
      },
    });
  },

  /**
   * Logs success when generate video quality
   * @param url
   *
   */

  removeTempFIles(filepath: string, module: string, action: string) {
   logSuccess({
      module: module,
      action: action,
      message: FILE_CONSTANTS.MESSAGES.WORKER.REMOVED_TEMP_FILE_SUCCESS,
      data: {
        filepath,
      },
    });
  },
};

export default workerLogger;
