
import dotenv from 'dotenv';
import logs from '@dam/shared/logs';
import FILE_CONSTANTS from '@dam/shared/constants'





/**
 * Loads environment specific configuration
 */
import path from "node:path";


const environment = process.env.NODE_ENV || "development";

dotenv.config({
  path: path.resolve(process.cwd(), "../../.env." + environment),
});

const requiredEnv = ['PORT', 'DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'JWT_SECRET'];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    logs.logError({
      action: FILE_CONSTANTS.MESSAGES.ACTION.UNHANDLED_ERROR,
      module: FILE_CONSTANTS.MESSAGES.MODULE.GLOBAL_ERROR,
      message: FILE_CONSTANTS.MESSAGES.COMMON.ENV_KEY_MISSING_ERROR + process.env[key],
    });

    throw new Error(
      FILE_CONSTANTS.MESSAGES.COMMON.ENV_KEY_MISSING_ERROR
    );
    // throw new Error(`Environment variable ${key} is missing.`);
  }
});



export default environment;
