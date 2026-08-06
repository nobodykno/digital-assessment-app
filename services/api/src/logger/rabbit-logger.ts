import FILE_CONSTANTS from '@dam/shared/constants'
import middleware from '../middleware/index.js';

const rabbitLogger = {
  /**
   * Logs success when rabbitmq connected
   * @param message
   *
   */

  connected(url: string) {
    middleware.logSuccess({
      module: FILE_CONSTANTS.MESSAGES.MODULE.RABBIT_LOGGER,
      action: FILE_CONSTANTS.MESSAGES.ACTION.CONNECTION_SUCCESS_LOGGER,
      message: FILE_CONSTANTS.MESSAGES.RABBIT_MQ.CONNECTED_SUCCESSFULLY,
      data: {
        url,
      },
    });
  },

  /**
   * Logs success when rabbitmq connected to a queue
   * @param message
   *
   */

  connectedQueue(queue: string) {
    middleware.logSuccess({
      module: FILE_CONSTANTS.MESSAGES.MODULE.RABBIT_LOGGER,
      action: FILE_CONSTANTS.MESSAGES.ACTION.CONNECT_TO_RABBIT_QUEUE,
      message: FILE_CONSTANTS.MESSAGES.RABBIT_MQ.CONNECTED_QUEUE_SUCCESSFULLY,
      data: {
        queue,
      },
    });
  },

  /**
   * Logs success when rabbitmq published a message
   * @param message
   *
   */

  publishMessageSuccessfully(message: string) {
    middleware.logSuccess({
      module: FILE_CONSTANTS.MESSAGES.MODULE.RABBIT_LOGGER,
      action: FILE_CONSTANTS.MESSAGES.ACTION.PUBLISHED_RABBIT_QUEUE_SUCCESS,
      message: FILE_CONSTANTS.MESSAGES.RABBIT_MQ.PUBLISHED_TASK_SUCCESSFULLY,
      data: {
        message,
      },
    });
  },

  /**
   * Logs success when rabbitmq consume
   * @param message
   *
   */

  consumeMessageSuccessfully(message: string) {
    middleware.logSuccess({
      module: FILE_CONSTANTS.MESSAGES.MODULE.RABBIT_LOGGER,
      action: FILE_CONSTANTS.MESSAGES.ACTION.CONSUME_RABBIT_QUEUE_SUCCESS,
      message: FILE_CONSTANTS.MESSAGES.RABBIT_MQ.CONSUME_TASK_SUCCESSFULLY,
      data: {
        message,
      },
    });
  },
};

export default rabbitLogger;
