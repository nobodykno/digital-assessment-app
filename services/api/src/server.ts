import "./config/env.js";

import app from "./app.js";
import validateEnv from "./config/validate-env.js";
import sequelize from "@dam/database/config";

const PORT = Number(process.env.PORT) || 5000;

const connectDatabase = async (): Promise<void> => {
  const maxRetries = 5;
  const retryDelay = 5000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await sequelize.sequelize.authenticate();

      await sequelize.sequelize.sync();

      return;
    } catch (error) {
    
      if (attempt === maxRetries) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
};

const startServer = async (): Promise<void> => {
  try {
    // 1. Validate environment variables
    validateEnv();

    // 2. Connect to database
    await connectDatabase();

    // 3. Start HTTP server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

void startServer();