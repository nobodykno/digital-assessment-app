import { jest } from '@jest/globals';

import repository from '@dam/database/repositories';
import utils from '../../../utils/index.js';

const findUser = jest.fn() as jest.MockedFunction<
  typeof repository.authRepository.findUser
>;

const createUser = jest.fn() as jest.MockedFunction<
  typeof repository.authRepository.createUser
>;

const comparePassword = jest.fn() as jest.MockedFunction<
  typeof utils.password.comparePassword
>;

const hashPassword = jest.fn() as jest.MockedFunction<
  typeof utils.password.hashPassword
>;

jest.unstable_mockModule('@dam/database/repositories', () => ({
  default: {
    authRepository: {
      findUser,
      createUser,
    },
  },
}));

jest.unstable_mockModule('../../../utils/index.js', () => ({
  default: {
    password: {
      comparePassword,
      hashPassword,
    },
  },
}));

const { loginService, createUserService } =
  await import('../../../service/auth-service.js');

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    process.env.JWT_SECRET = 'test-secret';
  });

  describe('loginService', () => {
    it('should login successfully', async () => {
      findUser.mockResolvedValue({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword',
      } as any);

      comparePassword.mockResolvedValue(true);

      const result = await loginService({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(findUser).toHaveBeenCalledWith('test@example.com');

      expect(comparePassword).toHaveBeenCalledWith(
        'password123',
        'hashedpassword',
      );

      expect(result).toEqual({
        message: expect.any(String),
        token: expect.any(String),
      });
    });

    it('should throw error when user does not exist', async () => {
      findUser.mockResolvedValue(null);

      await expect(
        loginService({
          email: 'test@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow();

      expect(findUser).toHaveBeenCalledWith('test@example.com');

      expect(comparePassword).not.toHaveBeenCalled();
    });

    it('should throw error when password is invalid', async () => {
      findUser.mockResolvedValue({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword',
      } as any);

      comparePassword.mockResolvedValue(false);

      await expect(
        loginService({
          email: 'test@example.com',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow();

      expect(comparePassword).toHaveBeenCalledWith(
        'wrongpassword',
        'hashedpassword',
      );
    });
  });

  describe('createUserService', () => {
    it('should create a user successfully', async () => {
      findUser.mockResolvedValue(null);

      hashPassword.mockResolvedValue('hashedpassword');

      createUser.mockResolvedValue({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword',
      } as any);

      const result = await createUserService({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(findUser).toHaveBeenCalledWith('test@example.com');

      expect(hashPassword).toHaveBeenCalledWith('password123');

      expect(createUser).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword',
      });

      expect(result).toEqual({
        message: expect.any(String),
        result: {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
        },
      });
    });

    it('should throw error when email already exists', async () => {
      findUser.mockResolvedValue({
        id: 1,
        name: 'Existing User',
        email: 'test@example.com',
        password: 'hashedpassword',
      } as any);

      await expect(
        createUserService({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow();

      expect(findUser).toHaveBeenCalledWith('test@example.com');

      expect(createUser).not.toHaveBeenCalled();

      expect(hashPassword).not.toHaveBeenCalled();
    });
  });
});