
import dotenv from 'dotenv';
import logs from '@dam/shared/logs';
import FILE_CONSTANTS from '@dam/shared/constants'

import { AppError } from '../middleware/app-error.js';




/**
 * Loads environment specific configuration
 */
import path from "node:path";


const environment = process.env.NODE_ENV || "development";

dotenv.config({
  path: path.resolve(process.cwd(), "../../.env." + environment),
});

// console.log("DB_HOST:", process.env.DB_HOST);
// console.log("DB_PORT:", process.env.DB_PORT);
// console.log("DB_NAME:", process.env.DB_NAME);
// console.log("DB_USER:", process.env.DB_USER);

const requiredEnv = ['PORT', 'DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'JWT_SECRET'];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    logs.logError({
      action: FILE_CONSTANTS.MESSAGES.ACTION.UNHANDLED_ERROR,
      module: FILE_CONSTANTS.MESSAGES.MODULE.GLOBAL_ERROR,
      message: FILE_CONSTANTS.MESSAGES.COMMON.ENV_KEY_MISSING_ERROR + process.env[key],
    });

    throw new AppError(
      FILE_CONSTANTS.MESSAGES.COMMON.ENV_KEY_MISSING_ERROR,
      FILE_CONSTANTS.HTTP_STATUS.BAD_REQUEST,
    );
    // throw new Error(`Environment variable ${key} is missing.`);
  }
});

console.log(`Running in ${environment} mode`);

export default environment;
