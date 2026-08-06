import '../config/env.js'
import migrator from '../config/migrator.js';

import FILE_CONSTANTS from '@dam/shared/constants'
/**
 * Config file for controlling migration
 */
const migrate = async (): Promise<void> => {
  try {
    console.log(FILE_CONSTANTS.MESSAGES.MIGRATIONS.MIGRATION_RUNNING);

    const migrations = await migrator.up();

    migrations.forEach((migration) => {
      console.log(`✓ ${migration.name}`);
    });

    console.log(FILE_CONSTANTS.MESSAGES.MIGRATIONS.ALL_MIGRATION_COMPLETED);
    process.exit(0);
  } catch (error) {
    console.error(FILE_CONSTANTS.MESSAGES.MIGRATIONS.MIGRATION_FAILED);
    console.error(error);

    process.exit(1);
  }
};

migrate();
