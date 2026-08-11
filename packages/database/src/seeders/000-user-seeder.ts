import bcrypt from 'bcryptjs';

import type { QueryInterface } from 'sequelize';

export const up = async ({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> => {
  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  await queryInterface.bulkInsert('users', [
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
};

export const down = async ({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> => {
  await queryInterface.bulkDelete('users', {
    id: 1,
  });
};
