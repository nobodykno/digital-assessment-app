import logs from '@dam/shared/logs';
import { ILog } from '../dto/logs/logs-dto.js';



/**
 * Return error log
 * @param payload
 */

const logError = (payload: ILog): void => {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  logs.logError(payload);
};

export default logError;
