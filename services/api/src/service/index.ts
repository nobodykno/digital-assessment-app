import * as auth from './auth-service.js';
import * as file from './file-service.js';
import rabbitmq from './rabbitmq-service.js';
import storageService from './storage-service.js';
import videoQualityService from './video-quality-service.js';
import videoThumbnailService from './video-thumbnail-service.js';

const service = {
  auth,
  file,
  storageService,
  rabbitmq,
  videoThumbnailService,
  videoQualityService,
};

export default service;
