import logs from '@dam/shared/logs';


/**
 *
 * @param payload
 * Log success
 */
const logSuccess = (payload: ILog): void => {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  logs.logSuccess(payload);
};

export default logSuccess;
