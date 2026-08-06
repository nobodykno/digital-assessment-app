import type { JwtPayload } from 'jsonwebtoken';

/**
 * DTO Login request
 */
export interface ILoginRequestDto {
  email: string;
  password: string;
}

/**
 * DTO Create user request
 */
export interface ICreateUserRequestDto {
  name: string;
  email: string;
  password: string;
}

/**
 * DTO jwt payload
 */

export interface IJwtPayload extends JwtPayload {
  id: number;
  email: string;
}
