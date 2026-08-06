import swaggerJsdoc from 'swagger-jsdoc';

import type { Options } from 'swagger-jsdoc';

const options: Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'DAM API',
      version: '1.0.0',
      description: 'Digital Asset Management API',
    },
    servers: [
      {
        url: '/v1/api',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },

      schemas: {
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'Password123',
            },
          },
        },

        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              example: 'Paramjit Jena',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'Password123',
            },
          },
        },

        InitUploadRequest: {
          type: 'object',
          required: ['fileName', 'mimeType'],
          properties: {
            fileName: {
              type: 'string',
              example: 'video.mp4',
            },
            mimeType: {
              type: 'string',
              example: 'video/mp4',
            },
          },
        },

        UploadPartResponse: {
          type: 'object',
          properties: {
            etag: {
              type: 'string',
              example: 'e4b7b8c5d9',
            },
            partNumber: {
              type: 'integer',
              example: 1,
            },
          },
        },

        File: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            fileName: {
              type: 'string',
              example: 'image.png',
            },
            mimeType: {
              type: 'string',
              example: 'image/png',
            },
            fileSize: {
              type: 'integer',
              example: 204800,
            },
            status: {
              type: 'string',
              example: 'Completed',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },

        ErrorResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Invalid request',
            },
            statusCode: {
              type: 'integer',
              example: 400,
            },
          },
        },
      },
    },
  },

  apis: ['./src/route/*.ts'],
};

export default swaggerJsdoc(options);