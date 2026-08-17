import bcrypt from 'bcryptjs';

import type { QueryInterface } from 'sequelize';

export const up = async ({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> => {
  const password = process.env.USER_PASSWORD!
  const hashedPassword = await bcrypt.hash(password, 10);

  await queryInterface.bulkInsert('users', [
    {
      name: process.env.USER,
      email: process.env.USER_MAIL,
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
