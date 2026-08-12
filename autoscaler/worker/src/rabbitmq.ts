import amqp from "amqplib";
import type { Channel } from "amqplib";

let connection: Awaited<
  ReturnType<typeof amqp.connect>
> | null = null;

const rabbitMQHost =
  process.env.RABBITMQ_HOST ?? "rabbitmq";

const rabbitMQPort =
  process.env.RABBITMQ_PORT ?? "5672";

const rabbitMQUser =
  process.env.RABBITMQ_USERNAME;

const rabbitMQPassword =
  process.env.RABBITMQ_PASSWORD;

const rabbitMQVhost =
  process.env.RABBITMQ_VHOST ?? "dam";

if (!rabbitMQUser) {
  throw new Error("RABBITMQ_USER is not configured");
}

if (!rabbitMQPassword) {
  throw new Error(
    "RABBITMQ_PASSWORD is not configured",
  );
}

const rabbitMQUrl =
  `amqp://${encodeURIComponent(rabbitMQUser)}:` +
  `${encodeURIComponent(rabbitMQPassword)}@` +
  `${rabbitMQHost}:${rabbitMQPort}/` +
  `${encodeURIComponent(rabbitMQVhost)}`;

/**
 * Connect to RabbitMQ or reuse the existing connection.
 */
const connectRabbitMQ = async (): Promise<
  Awaited<ReturnType<typeof amqp.connect>>
> => {
  if (connection) {
    return connection;
  }

  console.log(
    `Connecting to RabbitMQ ${rabbitMQHost}:${rabbitMQPort}`,
  );

  connection = await amqp.connect(rabbitMQUrl);

  console.log("RabbitMQ connected");

  connection.on("close", () => {
    console.log("RabbitMQ connection closed");
    connection = null;
  });

  connection.on("error", (error) => {
    console.error(
      "RabbitMQ connection error:",
      error,
    );
  });

  return connection;
};

/**
 * Get the number of waiting messages in a queue.
 *
 * If the queue does not exist yet, return 0.
 * This allows the autoscaler to continue running
 * while workers are starting up.
 */
export const getQueueSize = async (
  queue: string,
): Promise<number> => {
  const conn = await connectRabbitMQ();

  const channel: Channel =
    await conn.createChannel();

  try {
    const queueInfo =
      await channel.checkQueue(queue);

    return queueInfo.messageCount;
  } catch {
    console.warn(
      `⚠️ Queue "${queue}" does not exist yet. Returning 0.`,
    );

    return 0;
  } finally {
    /*
     * checkQueue() causes RabbitMQ to close the
     * channel when the queue does not exist.
     *
     * Therefore, channel.close() may itself throw.
     * Ignore that error.
     */
    try {
      await channel.close();
    } catch {
      // Channel already closed by RabbitMQ.
    }
  }
};