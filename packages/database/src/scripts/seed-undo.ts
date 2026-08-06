import '../config/env.js'
import seeder from '../config/seeder.js';

/**
 * Config to undo seeds data
 */

const undoSeed = async (): Promise<void> => {
  try {
    const seeded = await seeder.down();

    if (seeded) {
      console.log(`Rolled back ${seeded}`);
    } else {
      console.log('No seeders to rollback.');
    }

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

void undoSeed();
