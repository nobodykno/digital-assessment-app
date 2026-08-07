import FILE_CONSTANTS from '@dam/shared/constants'
import logSuccess from '../middleware/success-logger.js';

const authLogger = {
  /**
   * Logs success when login
   * @param email
   */
  login(email: string) {
  logSuccess({
      module: FILE_CONSTANTS.MESSAGES.MODULE.AUTH,
      action: FILE_CONSTANTS.MESSAGES.ACTION.REGISTER,
      message: FILE_CONSTANTS.MESSAGES.AUTH.LOGIN_SUCCESS,
      data: {
        email,
      },
    });
  },

  /**
   * Log success when register successfully
   * @param email
   */

  register(email: string) {
   logSuccess({
      module: FILE_CONSTANTS.MESSAGES.MODULE.AUTH,
      action: FILE_CONSTANTS.MESSAGES.ACTION.LOGIN,
      message: FILE_CONSTANTS.MESSAGES.AUTH.USER_REGISTERED,
      data: {
        email,
      },
    });
  },
};

export default authLogger;
