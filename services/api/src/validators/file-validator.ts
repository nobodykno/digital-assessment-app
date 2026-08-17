import { z } from 'zod';

import FILE_CONSTANTS from '@dam/shared/constants'

/**
 * Validate fileId in params
 */

const fileParamsSchema = z.object({
  fileId: z.coerce
    .number()
    .int(FILE_CONSTANTS.MESSAGES.SCHEMA_VALIDATION.INVALID_NUMBER('FileId'))
    .positive(FILE_CONSTANTS.MESSAGES.SCHEMA_VALIDATION.POSITIVE_NUMBER('FileId')),
});

/**
 * Validate part upload
 */

const partUploadParamsSchema = z.object({
  fileId: z.coerce
    .number()
    .int(FILE_CONSTANTS.MESSAGES.SCHEMA_VALIDATION.INVALID_NUMBER('FileId'))
    .positive(FILE_CONSTANTS.MESSAGES.SCHEMA_VALIDATION.POSITIVE_NUMBER('FileId')),

  processingId: z.coerce
    .number()
    .int(FILE_CONSTANTS.MESSAGES.SCHEMA_VALIDATION.INVALID_NUMBER('ProcessingId'))
    .positive(FILE_CONSTANTS.MESSAGES.SCHEMA_VALIDATION.POSITIVE_NUMBER('ProcessingId')),

  partNumber: z.coerce
    .number()
    .int(FILE_CONSTANTS.MESSAGES.SCHEMA_VALIDATION.INVALID_NUMBER('PartNumber'))
    .positive(FILE_CONSTANTS.MESSAGES.SCHEMA_VALIDATION.POSITIVE_NUMBER('PartNumber')),
});

/**
 * Validate initUpload
 */

const initFileSchema = {
  body: z
    .object({
      fileName: z
        .string()
        .regex(FILE_CONSTANTS.MESSAGES.VALIDATION.ALLOWED_TEXT)
        .trim()
        .regex(
          FILE_CONSTANTS.MESSAGES.VALIDATION.ALLOWED_TEXT,
          FILE_CONSTANTS.MESSAGES.FILE.INVALID_FILE_NAME,
        )
        .min(10, FILE_CONSTANTS.MESSAGES.SCHEMA_VALIDATION.MIN_LENGTH('File Name', 10))
        .max(255, FILE_CONSTANTS.MESSAGES.SCHEMA_VALIDATION.MAX_LENGTH('Project name', 255)),

      mimeType: z
        .string()
        .regex(
          FILE_CONSTANTS.MESSAGES.VALIDATION.ALLOWED_MIME_TYPE,
          FILE_CONSTANTS.MESSAGES.FILE.INVALID_FILE_TYPE,
        )
        .trim(),
    })
    .strict(),
};

/**
 * Validate params of completeupload schema
 */

const completeUploadParamsSchema = z.object({
  fileId: z.coerce
    .number()
    .int(FILE_CONSTANTS.MESSAGES.SCHEMA_VALIDATION.INVALID_NUMBER('FileId'))
    .positive(FILE_CONSTANTS.MESSAGES.SCHEMA_VALIDATION.POSITIVE_NUMBER('FileId')),

  processingId: z.coerce
    .number()
    .int(FILE_CONSTANTS.MESSAGES.SCHEMA_VALIDATION.INVALID_NUMBER('ProcessingId'))
    .positive(FILE_CONSTANTS.MESSAGES.SCHEMA_VALIDATION.POSITIVE_NUMBER('ProcessingId')),
});

/**
 * Validate params of downloadschema
 */

const downloadParamsSchema = z.object({
  fileId: z.coerce
    .number()
    .int(FILE_CONSTANTS.MESSAGES.SCHEMA_VALIDATION.INVALID_NUMBER('FileId'))
    .positive(FILE_CONSTANTS.MESSAGES.SCHEMA_VALIDATION.POSITIVE_NUMBER('FileId')),

  quality: z.coerce
    .string()
    .regex(
      FILE_CONSTANTS.MESSAGES.VALIDATION.ALLOWED_QUALITY,
      FILE_CONSTANTS.MESSAGES.FILE.INVALID_DOWNLOAD_QUALITY,
    ),
});
 

/**
 * 
 * Download files param schema
 */

const downloadFileParamsSchema = z.object({
  fileId: z.coerce
    .number()
    .int(FILE_CONSTANTS.MESSAGES.SCHEMA_VALIDATION.INVALID_NUMBER('FileId'))
    .positive(FILE_CONSTANTS.MESSAGES.SCHEMA_VALIDATION.POSITIVE_NUMBER('FileId')),
});

/**
 * Get all files based on type
 */

export const getFilesTypeParamsSchema = z.object({
  type: z
    .string()
    .regex(FILE_CONSTANTS.MESSAGES.VALIDATION.ALLOWED_FILE_TYPE, FILE_CONSTANTS.MESSAGES.FILE.INVALID_FILE_TYPE_PARAMS),
});


const getFilesQuerySchema = z.object({
  page: z.coerce
    .number()
    .int(FILE_CONSTANTS.MESSAGES.SCHEMA_VALIDATION.INVALID_NUMBER('Page'))
    .positive(FILE_CONSTANTS.MESSAGES.SCHEMA_VALIDATION.POSITIVE_NUMBER('Page'))
    .default(1),

  limit: z.coerce
    .number()
    .int(FILE_CONSTANTS.MESSAGES.SCHEMA_VALIDATION.INVALID_NUMBER('Limit'))
    .positive(FILE_CONSTANTS.MESSAGES.SCHEMA_VALIDATION.POSITIVE_NUMBER('Limit'))
    .max(
      100,
      FILE_CONSTANTS.MESSAGES.SCHEMA_VALIDATION.MAX_LENGTH('Limit', 100),
    )
    .default(10),

  search: z.string().optional(),
});




/**
 * Get file type
 */

const getFileTypeParams = {
  params: getFilesTypeParamsSchema,
  query: getFilesQuerySchema,
};

/**
 * Validate complete upload schema
 */

const completeUploadSchema = {
  params: completeUploadParamsSchema,
};

/**
 * Validate part upload schema
 */

const partUploadSchema = {
  params: partUploadParamsSchema,
};

/**
 * Validate delete file schema
 */

const validateFileIdSchema = {
  params: fileParamsSchema,
};

/**
 * Validate download file schema
 */

const downloadVideoFileSchema = {
  params: downloadParamsSchema,
};


/**
 * Validate download  file schema
 */

const downloadFileSchema = {
  params: downloadFileParamsSchema,
};



const fileValidators = {
  fileParamsSchema,
  validateFileIdSchema,
  partUploadSchema,
  initFileSchema,
  completeUploadSchema,
  downloadFileSchema,
  getFileTypeParams,
  downloadVideoFileSchema
};

export default fileValidators;
