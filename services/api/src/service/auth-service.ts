import jwt from 'jsonwebtoken';

import FILE_CONSTANTS from '@dam/shared/constants'
import logger from '../logger/index.js';
import { AppError } from '../middleware/app-error.js';
import repository from '@dam/database/repositories';
import utils from '../utils/index.js';

import type { ICreateUserRequestDto, ILoginRequestDto } from '../dto/request/auth-request-dto.js';
import type {
  ICreateUserResponseDto,
  ILoginResponseDto,
} from '../dto/response/auth-response-dto.js';

/**
 * @param loginInfo User login credentials.
 * @returns Login response containing JWT token and user information.
 */
export const loginService = async (loginInfo: ILoginRequestDto): Promise<ILoginResponseDto> => {
  const user = await repository.authRepository.findUser(loginInfo.email);

  if (!user) {
    logger.logError({
      module: FILE_CONSTANTS.MESSAGES.MODULE.AUTH_SERVICE_ERROR,
      action: FILE_CONSTANTS.MESSAGES.ACTION.SERVICE_AUTH_ERROR,
      message: FILE_CONSTANTS.MESSAGES.AUTH.INVALID_CREDENTIALS,
    });

    throw new AppError(
      FILE_CONSTANTS.MESSAGES.AUTH.INVALID_CREDENTIALS,
      FILE_CONSTANTS.HTTP_STATUS.UNAUTHORIZED,
    );
  }

  const isPasswordValid = await utils.password.comparePassword(loginInfo.password, user.password);

  if (!isPasswordValid) {
    logger.logError({
      module: FILE_CONSTANTS.MESSAGES.MODULE.AUTH_SERVICE_ERROR,
      action: FILE_CONSTANTS.MESSAGES.ACTION.SERVICE_AUTH_ERROR,
      message: FILE_CONSTANTS.MESSAGES.AUTH.INVALID_CREDENTIALS,
    });

    throw new AppError(
      FILE_CONSTANTS.MESSAGES.AUTH.INVALID_CREDENTIALS,
      FILE_CONSTANTS.HTTP_STATUS.UNAUTHORIZED,
    );
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: '24h',
    },
  );

  logger.authLogger.login(user.email);

  const response: ILoginResponseDto = {
    message: FILE_CONSTANTS.MESSAGES.AUTH.LOGIN_SUCCESS,
    token,
  };

  return response;
};

/**
 *
 * @param request accepts user info matching with dto
 * @returns
 */

export const createUserService = async (
  request: ICreateUserRequestDto,
): Promise<ICreateUserResponseDto> => {
  const existingUser = await repository.authRepository.findUser(request.email);

  if (existingUser) {
    logger.logError({
      module: FILE_CONSTANTS.MESSAGES.MODULE.AUTH_SERVICE_ERROR,
      action: FILE_CONSTANTS.MESSAGES.ACTION.SERVICE_AUTH_ERROR,
      message: FILE_CONSTANTS.MESSAGES.AUTH.USER_ALREADY_EXIST,
    });

    throw new AppError(
      FILE_CONSTANTS.MESSAGES.AUTH.USER_ALREADY_EXIST,
      FILE_CONSTANTS.HTTP_STATUS.BAD_REQUEST,
    );
  }

  const hashedPassword = await utils.password.hashPassword(request.password);

  const payload: ICreateUserRequestDto = {
    name: request.name,
    email: request.email,
    password: hashedPassword,
  };

  const user = await repository.authRepository.createUser(payload);

  logger.authLogger.register(user.email);

  const response = {
    message: FILE_CONSTANTS.MESSAGES.AUTH.USER_REGISTERED,
    result: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };

  return response;
};
