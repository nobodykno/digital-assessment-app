import "./config/env.js";

import logger from "@dam/shared/logs";

import consumers from "./consumers/index.js";

const startWorker = async (): Promise<void> => {
  try {
    logger.logSuccess({
      module: "Processing Worker",
      action: "STARTUP",
      message: "Starting processing worker...",
    });

    await consumers.start();

    logger.logSuccess({
      module: "Processing Worker",
      action: "STARTUP",
      message: "Processing worker started successfully.",
    });
  } catch (error) {

    console.log("error",error);

    logger.logError({
      module: "Processing Worker",
      action: "STARTUP",
      message:
        error instanceof Error ? error.message : "Unknown startup error",
    });

    process.exit(1);
  }
};

void startWorker();