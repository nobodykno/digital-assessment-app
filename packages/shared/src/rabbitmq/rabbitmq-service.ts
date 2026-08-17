
import amqp from "amqplib";



import type { Channel, ConsumeMessage,   ConfirmChannel } from "amqplib";
import { rabbitMQConfig, rabbitMQUrl } from "./setup.js";


let connection: Awaited<ReturnType<typeof amqp.connect>> | null = null;
const channels = new Map<string, Channel>();
const publishChannels = new Map<string, ConfirmChannel>();
const consumers = new Map<string, string>();
let activeJobs = 0;

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

const deadLetterExchange = `${queue}.dlx`;
const deadLetterQueue = `${queue}.failed`;
await channel.assertExchange(
  deadLetterExchange,
  'direct',
  {
    durable: true,
  },
);

await channel.assertQueue(
  deadLetterQueue,
  {
    durable: true,
  },
);

await channel.bindQueue(
  deadLetterQueue,
  deadLetterExchange,
  queue,
);

await channel.assertQueue(queue, {
  durable: true,
  arguments: {
    'x-dead-letter-exchange': deadLetterExchange,
    'x-dead-letter-routing-key': queue,
  },
});

  channels.set(queue, channel);
};

/**
 * Publish a message to a queue.
 */
const publishMessage = async <T>(queue: string, message: T): Promise<void> => {

  const channel =  await connectPublishChannel(queue);

  try{
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });

    await channel.waitForConfirms();
  } catch (error) {
    console.error(`Failed to publish message to "${queue}"`,error);

    throw error;
  }


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

  await channel.prefetch(1);
  const consumerInformation =  await channel.consume(queue, (msg: ConsumeMessage | null): void => {
    if (!msg) {
      return;
    }
 

    activeJobs++;

    void processMessage(msg, channel, handler);
  });

  consumers.set(queue, consumerInformation.consumerTag);
};


const stopConsuming = async (
  queue: string,
): Promise<void> => {
  const channel = channels.get(queue);
  const consumerTag = consumers.get(queue);

  if (!channel || !consumerTag) {
    return;
  }

  try {
    await channel.cancel(consumerTag);

    consumers.delete(queue);

  } catch (error) {
    console.error(
      `Failed to stop RabbitMQ consumer "${queue}":`,
      error,
    );
  }
};

const connectPublishChannel = async (
  queue: string,
): Promise<ConfirmChannel> => {
  if (!connection) {
    connection = await amqp.connect(rabbitMQUrl);
  }

  const existingChannel =
    publishChannels.get(queue);

  if (existingChannel) {
    return existingChannel;
  }

  const channel =
    await connection.createConfirmChannel();

    const deadLetterExchange = `${queue}.dlx`;
    const deadLetterQueue = `${queue}.failed`;
    await channel.assertExchange(
      deadLetterExchange,
      'direct',
      {
        durable: true,
      },
    );
    
    await channel.assertQueue(
      deadLetterQueue,
      {
        durable: true,
      },
    );
    
    await channel.bindQueue(
      deadLetterQueue,
      deadLetterExchange,
      queue,
    );
    
    await channel.assertQueue(queue, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': deadLetterExchange,
        'x-dead-letter-routing-key': queue,
      },
    });


  publishChannels.set(queue, channel);

  return channel;
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
  activeJobs--;
};


const waitForActiveJobs = async (): Promise<void> => {
  while (activeJobs > 0) {
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
  }
};
/**
 * Close all channels and the connection.
 */
const closeRabbitMQ = async (): Promise<void> => {
  for (const queue of consumers.keys()) {
    await stopConsuming(queue);
  }

  await waitForActiveJobs();

    // Close channels.
    for (const [queue, channel] of channels.entries()) {
      try {
        await channel.close();
      } catch (error) {
        console.error(
          `Failed to close RabbitMQ channel "${queue}":`,
          error,
        );
      }
    }

    channels.clear();
    consumers.clear();
  

    for (const [queue, channel] of publishChannels.entries()) {
      try {
        await channel.close();
      } catch (error) {
        console.error(
          `Failed to close RabbitMQ channel "${queue}":`,
          error,
        );
      }
    }

  publishChannels.clear();


  if (connection) {
    try {
      await connection.close();
    } catch (error) {
    } finally {
      connection = null;
    }
  }

};


const getQueueSize = async (
  queue: string,
): Promise<number> => {
  await connectRabbitMQ(queue);

  const channel = channels.get(queue);

  if (!channel) {
    throw new Error(`Channel is not initialized.`);
  }



  try {
    const queueInfo =
      await channel.checkQueue(queue);
    return queueInfo.messageCount;
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === 404
    ) {
      console.warn(
        `RabbitMQ queue "${queue}" does not exist yet. Returning 0.`,
      );

      return 0;
    }

    throw error;
  }
};



//Test the working of actual autoscaler



const getQueueWorkload = async (
  queue: string,
): Promise<any> => {
  const rabbitMQManagementUrl =
  'http://rabbitmq:15672';
  // RabbitMQ Management API
  const url =`${rabbitMQManagementUrl}/api/queues/` +
  `${encodeURIComponent(rabbitMQConfig.vhost)}/` +
  `${encodeURIComponent(queue)}`;

  // RabbitMQ username/password
  const username = 'paramjit';
  const password = 'MyStrongPassword@123';

  const credentials =
    Buffer.from(
      `${username}:${password}`,
    ).toString('base64');

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `RabbitMQ Management API returned ${response.status}`,
      );
    }

    const data = await response.json();

    const ready =
      data.messages_ready ?? 0;

    const unacked =
      data.messages_unacknowledged ?? 0;

    const total =
      ready + unacked;

    console.log(
      `[RabbitMQ] Ready: ${ready}`,
    );

    console.log(
      `[RabbitMQ] Unacked: ${unacked}`,
    );

    console.log(
      `[RabbitMQ] Total: ${total}`,
    );

    return {
      ready,
      unacked,
      total,
    };
  } catch (error) {
    console.error(
      `[RabbitMQ] Failed to get workload for "${queue}"`,
      error,
    );

    throw error;
  }
};
const rabbitMqService = {
    connectRabbitMQ,
    getQueueSize,
    publishMessage,
    consumeMessage,
    closeRabbitMQ,
    stopConsuming,
    getQueueWorkload
}
export default rabbitMqService;