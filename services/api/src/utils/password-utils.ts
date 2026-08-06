import bcrypt from 'bcryptjs';

/**
 * return hashed password.
 */
const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS ?? 10));
};

/**
 * Compare the password with hashed password
 */

const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

const password = {
  comparePassword,
  hashPassword,
};

export default password;
