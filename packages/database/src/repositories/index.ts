import authRepository from './auth-repository.js';
import fileRepository from './file-repository.js';
import videoQualityRepository from './video-quality-repository.js';

const repository = {
  fileRepository,
  videoQualityRepository,
  authRepository,
};

export default repository;
