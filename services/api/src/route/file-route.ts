import { Router, raw } from 'express';

import controller from '../controller/index.js';
import verifyToken from '../middleware/auth-token.js';
import schema from '../validators/index.js';
import { uploadMiddleware } from '../middleware/uploader.js';
import authenticateUser from '../middleware/user-owner.js';
import validate from '../middleware/validate.js';


const router: Router = Router({ mergeParams: true });
/**
 * Authenticated post route bearing url v1/api/files used to accept
 * multiple files other than video and zip file
 */

/**
 * @openapi
 * /files:
 *   post:
 *     tags:
 *       - Files
 *     summary: Upload files
 *     description: Upload one or more files.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UploadFilesRequest'
 *     responses:
 *       201:
 *         description: Files uploaded successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */


router.post(
  '/', 
  verifyToken,
  uploadMiddleware, 
  controller.FileController.uploadFiles);


/**
 * Authenticated get route bearing url v1/api/files/count used to return
 * count of files
 */

/**
 * @openapi
 * /files/count:
 *   get:
 *     tags:
 *       - Files
 *     summary: Get file count
 *     description: Returns the total count of files for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: File count retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.get('/count',
  verifyToken,
  controller.FileController.getFilesCount);



/**
 * Authenticated delete route bearing url v1/api/files/:fileid
 * having fileid as parameter used to delete a file
 */

/**
 * @openapi
 * /files/{fileId}:
 *   delete:
 *     tags:
 *       - Files
 *     summary: Delete file
 *     description: Delete a file by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       400:
 *         description: Invalid file ID
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.delete(
  '/:fileId',
  verifyToken,
 authenticateUser,
 validate(schema.fileValidators.validateFileIdSchema),
  controller.FileController.deleteFile
);

/**
 * Authenticated post route bearing url v1/api/files/init
 * used to initialize upload files
 */

/**
 * @openapi
 * /files/init:
 *   post:
 *     tags:
 *       - Files
 *     summary: Initialize upload
 *     description: Initialize a multipart file upload.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InitUploadRequest'
 *     responses:
 *       201:
 *         description: Upload initialized successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */

router.post(
  '/init',
  verifyToken,
 validate(schema.fileValidators.initFileSchema),
  controller.FileController.initUploadFiles,
);

/**
 * Authenticated post route bearing url v1/api/files/init
 * used to initialize upload files
 */


/**
 * @openapi
 * /files/{fileId}/{processingId}/{partNumber}:
 *   put:
 *     tags:
 *       - Files
 *     summary: Upload part
 *     description: Upload a part of a multipart upload.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: processingId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: partNumber
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/octet-stream:
 *           schema:
 *             type: string
 *             format: binary
 *     responses:
 *       200:
 *         description: Part uploaded successfully
 *       401:
 *         description: Unauthorized
 */


router.put(
  '/:fileId/:processingId/:partNumber',
  verifyToken,
 authenticateUser,
  raw({
    type: 'application/octet-stream',
    limit: '10gb',
  }),
  controller.FileController.uploadPart,
);

/**
 * Authenticated post route bearing url v1/api/files/init
 * used to initialize upload files
 */


/**
 * @openapi
 * /files/{fileId}/{processingId}/complete:
 *   post:
 *     tags:
 *       - Files
 *     summary: Complete upload
 *     description: Complete a multipart upload.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: processingId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompleteUploadRequest'
 *     responses:
 *       200:
 *         description: Upload completed successfully
 */


router.post(
  '/:fileId/:processingId/complete',
  verifyToken,
 authenticateUser,
 validate(schema.fileValidators.completeUploadSchema),
  controller.FileController.completeUpload,
);
/**
 * Authenticated post route bearing url v1/api/files/:fileid/:quality
 * used to download different clarity video
 */

/**
 * @openapi
 * /files/{fileId}/{quality}/download/video:
 *   get:
 *     tags:
 *       - Files
 *     summary: Download video
 *     description: Get the download URL for a processed video.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: quality
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Download URL returned
 *       201:
 *         description: Video processing is pending
 */

router.get(
  '/:fileId/:quality/download/video',
  verifyToken,
 authenticateUser,
 validate(schema.fileValidators.downloadVideoFileSchema),
  controller.FileController.downloadVideo,
);

/**
 * Authenticated post route bearing url v1/api/files/:fileId/download/file
 * used to download file
 */

/**
 * @openapi
 * /files/{fileId}/download/file:
 *   get:
 *     tags:
 *       - Files
 *     summary: Download file
 *     description: Get the download URL for a file.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Download URL returned
 *       201:
 *         description: File processing is pending
 */

router.get(
  '/:fileId/download/file',
  verifyToken,
 authenticateUser,
 validate(schema.fileValidators.downloadFileSchema),
  controller.FileController.downloadFile,
);

/**
 * Authenticated post route bearing url v1/api/files/:fileid
 * used to send status
 */

/**
 * @openapi
 * /files/{fileId}/status:
 *   get:
 *     tags:
 *       - Files
 *     summary: Get file status
 *     description: Get the processing status of a file.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: File status retrieved successfully
 */

router.get(
  '/:fileId/status',
  verifyToken,
 authenticateUser,
 validate(schema.fileValidators.validateFileIdSchema),
  controller.FileController.getFileStatus,
);



  /**
 * Authenticated get route bearing url v1/api/files used to return
 * multiple files belongs to a user
 */

  /**
 * @openapi
 * /files/{type}:
 *   get:
 *     tags:
 *       - Files
 *     summary: Get files
 *     description: Get paginated files by type.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           example: image
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Files retrieved successfully
 */

router.get('/:type',
  verifyToken,
 validate(schema.fileValidators.getFileTypeParams),
  controller.FileController.getFiles);
  
export default router;
