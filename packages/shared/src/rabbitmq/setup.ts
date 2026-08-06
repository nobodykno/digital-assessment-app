/**
 * Config setup for rabbitmq by accessing environment variable
 */

export const rabbitMQConfig = {
    host: process.env.RABBITMQ_HOST!,
    port: Number(process.env.RABBITMQ_PORT),
    username: process.env.RABBITMQ_USERNAME!,
    password: process.env.RABBITMQ_PASSWORD!,
    vhost: process.env.RABBITMQ_VHOST!,
  };
  
  export const rabbitMQUrl = `amqp://${rabbitMQConfig.username}:${rabbitMQConfig.password}@${rabbitMQConfig.host}:${rabbitMQConfig.port}/${rabbitMQConfig.vhost}`;
  