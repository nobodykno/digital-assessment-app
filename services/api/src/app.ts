import cors from 'cors';
import express from 'express';
import './models/index.js';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import config from './config/index.js';
import swaggerSpec from './config/swagger.js';
import middleware from './middleware/index.js';
import mainRoute from './route/main-route.js';
import service from './service/index.js';

const app = express();

app.use(cors(middleware.corsOptions));

await service.rabbitmq.connectRabbitMQ(config.rabbitMQQueues.image);
await service.rabbitmq.connectRabbitMQ(config.rabbitMQQueues.video);

app.use(express.json());

app.use(helmet());

if (process.env.NODE_ENV !== 'test') {
  app.use(middleware.globalRateLimiter);
}

app.use(middleware.morganMiddleware);
//Swagger doc

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec),
);


// Routes
app.use('/v1', mainRoute);



app.get('/', (req, res) => {
  res.json({
    message: 'File API',
  });
});

app.use(middleware.globalErrorHandler);

export default app;
