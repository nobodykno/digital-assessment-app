import { z } from 'zod';
import MESSAGES from '../constants/message';


/**
 * Validates login request.
 */
const loginSchema = z.object({

  email: z.email({
    error:MESSAGES.SCHEMA_VALIDATION.INVALID_EMAIL('Email')
  }),
        

  password: z
    .string()
    .min(5, MESSAGES.SCHEMA_VALIDATION.MIN_LENGTH('Password', 5))
    .max(100, MESSAGES.SCHEMA_VALIDATION.MAX_LENGTH('Password', 100)),

}).strict();


/**
 * Validates create user request.
 */
const createUserSchema =  z.object({


  name: z
    .string()
    .regex(MESSAGES.VALIDATION.ALLOWED_NAME,MESSAGES.AUTH.VALID_NAME)
    .trim()
    .min(8, MESSAGES.SCHEMA_VALIDATION.MIN_LENGTH('Name', 8))
    .max(100,  MESSAGES.SCHEMA_VALIDATION.MAX_LENGTH('Password', 100)),
      

  email:z.email({
    error:MESSAGES.SCHEMA_VALIDATION.INVALID_EMAIL('Email')
  }),

  password: z
    .string()
    .min(5, MESSAGES.SCHEMA_VALIDATION.MIN_LENGTH('Password', 5))
    .max(100, MESSAGES.SCHEMA_VALIDATION.MAX_LENGTH('Password', 100))

    
}).strict();

const authValidator = {
  loginSchema,
  createUserSchema
};

export default authValidator;