import amqp from "amqplib";



import type { Channel, ConsumeMessage } from "amqplib";
import { rabbitMQUrl } from "./setup.js";


let connection: Awaited<ReturnType<typeof amqp.connect>> | null = null;
const channels = new Map<string, Channel>();

/**
 * Creates (or reuses) a channel for the given queue.
 */
const connectRabbitMQ = async (queue: string): Promise<void> => {
  if (!connection) {
    connection = await amqp.connect(rabbitMQUrl);
  }

  if (channels.has(queue)) {
    return;
  }

  const channel = await connection.createChannel();

  await channel.assertQueue(queue, {
    durable: true,
  });

  channels.set(queue, channel);
};

/**
 * Publish a message to a queue.
 */
const publishMessage = <T>(queue: string, message: T): void => {
  const channel = channels.get(queue);

  if (!channel) {
    throw new Error(`RabbitMQ channel "${queue}" is not initialized.`);
  }

  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
};

/**
 * Consume messages from a queue.
 */
const consumeMessage = async <T>(
  queue: string,
  handler: (message: T) => Promise<void>,
): Promise<void> => {
  const channel = channels.get(queue);

  if (!channel) {
    throw new Error(`RabbitMQ channel "${queue}" is not initialized.`);
  }

  await channel.consume(queue, (msg: ConsumeMessage | null): void => {
    if (!msg) {
      return;
    }

    void processMessage(msg, channel, handler);
  });
};

const processMessage = async <T>(
  msg: ConsumeMessage,
  channel: Channel,
  handler: (message: T) => Promise<void>,
): Promise<void> => {
  try {
    const data = JSON.parse(msg.content.toString()) as T;

    await handler(data);

    channel.ack(msg);
  } catch {
    channel.nack(msg, false, false);
  }
};

/**
 * Close all channels and the connection.
 */
const closeRabbitMQ = async (): Promise<void> => {
  for (const channel of channels.values()) {
    await channel.close();
  }

  channels.clear();

  await connection?.close();

  connection = null;
};


const rabbitMqService = {
    connectRabbitMQ,
    publishMessage,
    consumeMessage,
    closeRabbitMQ,
}
export default rabbitMqService;