import rabbitmq from '@dam/shared/rabbitmq';

export const gracefulShutdown = async (
  signal: string,
  workerName: string,
): Promise<void> => {
  console.log(
    `Received ${signal}. Shutting down ${workerName}...`,
  );

  try {
    await rabbitmq.rabbitmqService.closeRabbitMQ();

    console.log(
      `${workerName} shut down gracefully`,
    );

    process.exit(0);
  } catch (error) {
    console.error(
      `${workerName} shutdown failed:`,
      error,
    );

    process.exit(1);
  }
};