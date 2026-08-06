import File from './file-model.js';
import FileProcessing from './file-processing-model.js';
import User from './user-model.js';
import VideoQuality from './video-quality-model.js';

import './association.js';

const model = {
  File,
  User,
  FileProcessing,
  VideoQuality,
};

export default model;
