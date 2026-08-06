import FILE_CONSTANTS from '@dam/shared/constants'
import service from '../service/index.js';

import type { ICreateUserRequestDto, ILoginRequestDto } from '../dto/request/auth-request-dto.js';
import type {
  ICreateUserResponseDto,
  ILoginResponseDto,
} from '../dto/response/auth-response-dto.js';
import type { NextFunction, Request, Response } from 'express';

/**
 *
 * @param req accepts request containing email and password.
 * @param res returning response containing jwt token .
 * @param next  next middleware function handle error.
 */
export const login = async (
  req: Request<object, ILoginResponseDto, ILoginRequestDto>,
  res: Response<ILoginResponseDto>,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await service.auth.loginService(req.body);

    res.status(FILE_CONSTANTS.HTTP_STATUS.OK).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param req accepts request containing name, email and password.
 * @param res returning response containing login member details .
 * @param next  next middleware function handle error.
 */
export const createUser = async (
  req: Request<object, ICreateUserResponseDto, ICreateUserRequestDto>,
  res: Response<ICreateUserResponseDto>,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await service.auth.createUserService(req.body);

    res.status(FILE_CONSTANTS.HTTP_STATUS.CREATED).json(response);
  } catch (error) {
    next(error);
  }
};
