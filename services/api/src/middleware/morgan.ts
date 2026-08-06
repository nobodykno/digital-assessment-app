import logs from '@dam/shared/logs';
import morgan from 'morgan';
/**
 * Custom Morgan stream that forwards HTTP request logs
 * to the application's Winston logger.
 */
const stream = {
  write: (message: string): void => {
    logs.logger.http(message.trim());
  },
};

const morganMiddleware =
  process.env.NODE_ENV === 'development'
    ? morgan('dev')
    : morgan(':method :url :status :response-time ms', {
        stream,
      });

export default morganMiddleware;
