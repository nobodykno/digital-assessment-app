/**
 * All magic string centralized at one place
 */

const MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: 'Login successful!',

    LOGIN_FAILED: 'Failed to login',

    INVALID_CREDENTIALS: 'Invalid email or password!',

    USER_ALREADY_EXIST: 'User already existed',

    USER_REGISTERED: 'User created successfully ',

    TOKEN_NOT_FOUND: 'Token not found',

    INVALID_TOKEN: 'Invalid details',

    USER_NOT_FOUND: 'User not found',

    NAME_INVALID: 'Name is invalid',
  },

  FILE_STATUS: {
    PENDING: 'Pending',
    COMPLETED: 'Completed',
    FAILED: 'Failed'
  },

  RABBIT_MQ: {
    CONNECTED_SUCCESSFULLY: 'Connected Successfully',
    CONNECTED_QUEUE_SUCCESSFULLY: 'Connected to queue Successfully',
    CONNECTED_FAILURE_QUEUE: 'Connection fail to queue',
    CONNECTED__FAIL: 'Connected fail',
    PUBLISHED_TASK_SUCCESSFULLY: 'Published task successfully',
    PUBLISHED_TASK_FAILURE: 'Published task failure',
    CONSUME_TASK_SUCCESSFULLY: 'Consume task successfully',
    CONSUME_TASK_FAILURE: 'Consume task failure',
  },

  FILE: {
    NO_FILES_UPLOADED: 'No files uploaded!',

    UPLOAD_SUCCESS: 'Files uploaded successfully!',

    FETCH_SUCCESS: 'Files fetched successfully!',

    FETCH_SUCCESS_COUNT: 'Files Count fetched successfully!',

    FETCH_FAIl_COUNT: 'Error in count fetch',

    FILE_NOT_FOUND: 'File not found!',

    DELETE_SUCCESS: 'File deleted successfully!',

    FILE_ID_NOT_FOUND: 'File id not found',

    INVALID_FILE_TYPE: 'Invalid file type!',

    INVALID_FILE_NAME: 'Invalid file Name!',

    INVALID_DOWNLOAD_QUALITY: 'Quality invalid it must be 360p,1080p,720p,480p',

    ERROR_S3: 'File intializtion failed',

    UPLOAD_ID_ERROR: 'Upload id invalid!',

    FILE_PART_SUCCESS: 'Part uploaded successfully.',

    FILE_PART_FAIL: 'Part uploaded failed!',

    FILE_UPLOAD_INITIATE_SUCCESS: 'File upload initiate successfully.',

    FILE_UPLOAD_INITIATE_FAIL: 'File initialization fail.',

    COMPLETE_UPLOAD_SUCCESS: 'File uploaded successfully',

    DOWNLOAD_FILE_SUCCESS: 'File downloaded successfully.',

    MIDDLEWARE_UPLOAD_ERROR: 'Middleware uploader error',

    INVALID_FILE: 'Invalid file',

    INVALID_FILE_TYPE_PARAMS: 'Type must be image, video, or document',

    BUFFER_ERROR: 'Request body must be a Buffer'
  },

  WORKER: {
    GENERATE_THUMBNAIL_VIDEO_SUCCESS: 'Generate video thumbnail success',
    GENERATE_THUMBNAIL_VIDEO_FAIL: 'Generate video thumbnail fail',
    GENERATE_VIDEO_QUALITY_SUCCESS: 'Generate video quality success',
    GENERATE_VIDEO_QUALITY_FAIL: 'Generate video quality fail',
    GENERATE_THUMBNAIL_IMAGE_SUCCESS: 'Generate video thumbnail success',
    GENERATE_THUMBNAIL_IMAGE_FAIL: 'Generate video thumbnail fail',
    VIDEO_QUALITY_MISSING: 'Video quality is required.',
    UPLOADED_VIDEO: 'Video uploaded to object storage',
    VIDEO_QUALITY_DB: 'Video quality updated to db.',
    VIDEO_QUALITY_DB_FAILED: 'Video Quality Generation Failed:',
    FFMPEG_BINARY_ERROR: 'Binary not found',
    REMOVED_TEMP_FILE_SUCCESS: 'Remove Temp file success',
    REMOVED_TEMP_FILE_FAIL: 'Remove Temp file fail',
    UNKNOWN_JOB: 'Unknown Job',
  },

  MODULE: {
    FILE: 'File',

    AUTH: 'Auth',

    GLOBAL_ERROR: 'Global error',

    ENV_ERROR: 'Environment error',

    AUTH_ERROR: 'Auth middleware error',

    CORS_ERROR: 'Cors error!',

    MIDDLEWARE_UPLOADER: 'Middleware uploader error',

    USER_OWNER: 'Ownership error',

    SCHEMA: 'Schema Error',

    AUTH_SERVICE_ERROR: 'Auth service error',

    FILE_SERVICE_ERROR: 'File service error',

    RABBIT_LOGGER: 'Rabbit Logger',

    VIDEO_WORKER: 'Video Worker',

    IMAGE_WORKER: 'Video Worker',

    REMOVE_TEMP_FILE: 'Temp files removed',



  },

  ACTION: {
    CREATE: 'Create',

    UPDATE: 'Update',

    DELETE: 'Delete',

    GET: 'Get',

    LOGIN: 'Login',

    REGISTER: 'Register',

    COMPLETE: 'Complete',

    UPLOAD: 'Upload',

    DOWNLOAD: 'Download',

    UNHANDLED_ERROR: 'Unhandled Error',

    TOKEN_MISSING_ERROR: 'Invalid token',

    CORS_ISSUE: 'Cors origin do not match',

    MIDDLEWARE_UPLOADER: 'Middleware uploader',

    USER_OWNER_ERROR: 'Ownership',

    SCHEMA: 'Schema',

    SERVICE_AUTH_ERROR: 'Service auth error',

    SERVICE_FILE_ERROR: 'Service file error',

    CONNECTION_SUCCESS_LOGGER: 'Connect to RabbitMq',

    CONNECT_TO_RABBIT_QUEUE: 'Connected to a queue',

    PUBLISHED_RABBIT_QUEUE_SUCCESS: 'Published task successfully',

    PUBLISHED_RABBIT_QUEUE_FAIL: 'Published task failure',

    CONSUME_RABBIT_QUEUE_SUCCESS: 'Consume task successfully',

    CONSUME_RABBIT_QUEUE_FAIL: 'Consume task failure',

    GENERATE_VIDEO_THUMBNAIL: 'Generate Video thumbnail',

    GENERATE_IMAGE_THUMBNAIL: 'Generate Image thumbnail',

    GENERATE_VIDEO_QUALITY: 'Generate Video Quality',
  },

  MIGRATIONS: {
    MIGRATION_RUNNING: 'Running migrations..',

    ALL_MIGRATION_COMPLETED: 'All migrations completed',

    MIGRATION_FAILED: 'Migration failed',

    ROLLED_BACK: 'Rolled back',

    NO_MIGRATIONS_ROLLED_BACK: 'No migrations to rollback.',
  },

  COMMON: {
    SERVER_ERROR: 'Something went wrong!',

    T00_MANY_REQUEST: 'Too many requests. Please try again later.',

    VALIDATION_ERROR: 'Validation failed!',

    DUPLICATE_RESOURCE: 'Duplicate record found',

    ENV_KEY_MISSING_ERROR: 'Environment key missing',
  },

  VALIDATION: {
    ALLOWED_TEXT: /^(?=.{1,255}$)(?!\.)(?!.*\.\.)[\p{L}\p{N}._() -]+$/u,
    ALLOWED_MIME_TYPE:
      /^(application|audio|font|image|model|multipart|text|video)\/[a-z0-9][a-z0-9.+-]*$/i,
    ALLOWED_QUALITY: /^(360p|480p|720p|1080p)$/,
    ALLOWED_NAME: /^[A-Za-z]+$/,
    ALLOWED_FILE_TYPE: /^(image|video|document)$/
  },

  SCHEMA_VALIDATION: {
    INVALID_EMAIL: (field: string): string => {
      return `${field} is having invalid characters.`;
    },

    INVALID_NUMBER: (field: string): string => {
      return `${field} is having invalid chracter.`;
    },

    POSITIVE_NUMBER: (field: string): string => {
      return `${field} must be greater than zero`;
    },

    INVALID_CHARACTERS: (field: string): string => {
      return `${field} contains invalid characters.`;
    },

    REQUIRED: (field: string): string => {
      return `${field} is required.`;
    },

    MIN_LENGTH: (field: string, min: number): string => {
      return `${field} must be at least ${min} characters long.`;
    },

    MAX_LENGTH: (field: string, max: number): string => {
      return `${field} must not exceed  ${max} characters long.`;
    },

    MIN_FILE: (min: number): string => {
      return `Minimum ${min} file is required`;
    },
  },

  CORS: {
    CORS_ERROR: 'Origin not allowed by CORS',
  },
};

export default MESSAGES;
