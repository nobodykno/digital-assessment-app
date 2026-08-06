import model from '../models/index.js';

import type { ICreateUserRequestDto } from '../types/user-type.js';

/**
 * 
 * @param email 
 * @returns JSON containing user details by email
 */

const findUser = (email: string) => {
  return model.User.findOne({
    where: {
      email: email,
    },
  });
};

/**
 * 
 * @param user accepts user details 
 * @returns JSON containing user details by email
 */
const createUser = (user: ICreateUserRequestDto) => {
  return model.User.create(user);
};

const authRepository = {
  findUser,
  createUser,
};

export default authRepository;
