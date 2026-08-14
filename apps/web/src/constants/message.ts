

const MESSAGES = {

  FILE:{
    DELETE_FILE_SUCCESS: 'File deleted successfully',
    DELETE_FILE_FAIL: 'File fail to delete',
    FAILED_DOWNLOAD: 'Fail to download file',
    FAILED_UPLOAD: 'Fail to upload file',
    FILE_QUALITY_PROCESSING: 'Generating file quality ! please try after sometime',
    FILE_UPLOAD_SUCCESS: ' File Uploaded successfully'
  },
  
  AUTH:{

    VALID_EMAIL: 'Please enter a valid email address',

    VALID_NAME: 'Please enter a valid name',

    MIN_LENGTH_NAME: 'Your name must be at least ',

    LOGIN_SUCCESS: 'Login successful',

    LOGIN_FAILED: 'Login failed',

    REGISTER_SUCCESS: 'Registration successful',

    REGISTER_FAILED: 'Registration failed',

    AUTH_VALUE_MISSING: 'useAuth must be used inside AuthProvider'
  },

  ENV: {
    MISSING_VALUE:'Env value is missing'
    
  },

  DOWNLOAD_QUALITY:{
    QUALITY_MISSING:'The requested quality is being prepared. Please try again after some time.',
  },

  VALIDATION: {
    ALLOWED_NAME: /^[A-Za-z]+$/
  },
    
  SCHEMA_VALIDATION:{
    
    INVALID_EMAIL:(field: string): string => {
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

};

export default MESSAGES;