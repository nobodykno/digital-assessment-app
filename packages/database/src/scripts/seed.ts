import '../config/env.js'
import seeder from '../config/seeder.js';

/**
 * Config to run seeds data
 */

const seed = async (): Promise<void> => {
  try {
    console.log('Running seeders...');

    const seeded = await seeder.up();

    seeded.forEach((migration) => {
      console.log(`✓ ${migration.name}`);
    });

    console.log('Seeding completed.');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

void seed();
