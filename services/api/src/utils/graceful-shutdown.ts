

import sequelize from '@dam/database/config';
import shared from '@dam/shared';
import { Server } from 'http';

export const gracefulShutdown = (
  server: Server,
  signal: string,
): void => {
  console.log(`Received ${signal}. Starting graceful shutdown...`);

  server.close(async () => {
    try {
      await shared.rabbitmq.rabbitmqService.closeRabbitMQ();

      await sequelize.sequelize.close();
      process.exit(0);
    } catch (error) {
      console.error('Graceful shutdown failed:',error);
      process.exit(1);
    }
  });
};