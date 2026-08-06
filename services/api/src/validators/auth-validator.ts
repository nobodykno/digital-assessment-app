import { z } from 'zod';

import FILE_CONSTANTS from '@dam/shared/constants'

/**
 * Validates login request.
 */
const loginSchema = {
  body: z
    .object({
      email: z.email({
        error: FILE_CONSTANTS.MESSAGES.SCHEMA_VALIDATION.INVALID_EMAIL('Email'),
      }),

      password: z
        .string()
        .min(5, FILE_CONSTANTS.MESSAGES.SCHEMA_VALIDATION.MIN_LENGTH('Password', 5))
        .max(100, FILE_CONSTANTS.MESSAGES.SCHEMA_VALIDATION.MAX_LENGTH('Password', 100)),
    })
    .strict(),
};

/**
 * Validates create user request.
 */
const createUserSchema = {
  body: z
    .object({
      name: z
        .string()
        .regex(
          FILE_CONSTANTS.MESSAGES.VALIDATION.ALLOWED_NAME,
          FILE_CONSTANTS.MESSAGES.AUTH.NAME_INVALID,
        )
        .trim()
        .min(8, FILE_CONSTANTS.MESSAGES.SCHEMA_VALIDATION.MIN_LENGTH('Name', 8))
        .max(100, FILE_CONSTANTS.MESSAGES.SCHEMA_VALIDATION.MAX_LENGTH('Password', 100)),

      email: z.email({
        error: FILE_CONSTANTS.MESSAGES.SCHEMA_VALIDATION.INVALID_EMAIL('Email'),
      }),

      password: z
        .string()
        .min(5, FILE_CONSTANTS.MESSAGES.SCHEMA_VALIDATION.MIN_LENGTH('Password', 5))
        .max(100, FILE_CONSTANTS.MESSAGES.SCHEMA_VALIDATION.MAX_LENGTH('Password', 100)),
    })
    .strict(),
};
const authValidator = {
  loginSchema,
  createUserSchema,
};

export default authValidator;
