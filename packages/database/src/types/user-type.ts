import type { Optional } from 'sequelize';

/**
 * Attribute  for user attribute
 */

export interface IUserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
}

export type ICreateUserRequestDto = Optional<IUserAttributes, 'id'>;
