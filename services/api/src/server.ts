import './config/env.js';

import app from './app.js';
import validateEnv from './config/validate-env.js';


validateEnv();

// middleware.validateEnv();

import sequelize from '@dam/database/config'

// await service.rabbitmq.connectRabbitMQ();
const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  try {
    // Step 1 — Connect to database
    await sequelize.sequelize.authenticate();
    await sequelize.sequelize.sync();

    // console.log("✅ Database connected",process.cwd());
    // const uploadDir = path.join(process.cwd(), "/uploads");

    // Step 3 — Start server
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error);

    process.exit(1);
  }
};

void startServer();
