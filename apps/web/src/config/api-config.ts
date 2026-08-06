import env from './env';

/**
 * Config file for  API
 */
export const API = {
  AUTH: {
    LOGIN: {
      url: `${env.apiUrl}/login`,
      method: 'POST',
    },

    REGISTER: {
      url: `${env.apiUrl}/register`,
      method: 'POST',
    },
  },

  FILE: {
    FILE_COUNT: {
      url: `${env.apiUrl}/files/count`,
      method: 'GET',
    },

    GET_FILES_TYPE: (
      type: string,
      page: number,
      limit: number,

    ) => ({
      url: `${env.apiUrl}/files/${type}?page=${page}&limit=${limit}`,
      method: 'GET',
    }),

    GET_FILES_STATUS: (id: number) => ({
      url: `${env.apiUrl}/files/${id}/status`,
      method: 'GET',
    }),



    VIDEO_STATUS: (
      fileId: number,
      quality: string,
    ) => ({
      url: `${env.apiUrl}/files/${fileId}/${quality}/status`,
      method: 'GET',
    }),
  
    UPLOAD_FILE: {
      url: `${env.apiUrl}/files`,
      method: 'POST',
    },

    /**
     * Initialize Multipart Upload
     */
    INIT_UPLOAD: {
      url: `${env.apiUrl}/files/init`,
      method: 'POST',
    },

    /**
     * Upload One Chunk
     */
    UPLOAD_PART:(fileId:number, processingId:number,  partNumber:number) => ({
      url: `${env.apiUrl}/files/${fileId}/${processingId}/${partNumber}`,
      method: 'PUT',
    }),

    /**
     * Complete Multipart Upload
     */
    COMPLETE_UPLOAD: (fileId:number, processingId:number) => ({
      url: `${env.apiUrl}/files/${fileId}/${processingId}/complete`,
      method: 'POST',
    }),

    /**
     * Download Image / Document
     */
    DOWNLOAD_FILE: (fileId:number) => ({
      url: `${env.apiUrl}/files/${fileId}/download/file`,
      method: 'GET',
    }),

    /**
     * Download Video Quality
     */
    DOWNLOAD_VIDEO: (fileId: number, quality:string) => ({
      url: `${env.apiUrl}/files/${fileId}/${quality}/download/video`,
      method: 'GET',
    }),

    /**
     * Delete File
     */
    DELETE_FILE:(fileId: number) => ({
      url: `${env.apiUrl}/files/${fileId}`,
      method: 'DELETE',
    }),
  },
};

export default API;