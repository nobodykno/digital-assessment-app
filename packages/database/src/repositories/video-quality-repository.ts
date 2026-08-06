import model from '../models/index.js';

import type { IVideoQualityCreateAttributes } from '../types/video-quality-type.js';


/**
 * 
 * @param fileId 
 * @returns video path by quality
 */
const findVideoQuality = (fileId: number) => {
  return model.VideoQuality.findOne({
    where: {
      file_id: fileId,
    },
  });
};

/**
 * 
 * @param update accepts video quality attribute
 * @param fileId  accepts file attributes
 * @returns updated rows
 */

const updateVideoQuality = (update: IVideoQualityCreateAttributes, fileId: number) => {
  return model.VideoQuality.update(update, {
    where: {
      file_id: fileId,
    },
  });
};


/**
 * 
 * @param update accepts video quality attribute
 * JSON containing video quality attribute
 */
const createVideoQuality = (videoQuality: IVideoQualityCreateAttributes) => {
  return model.VideoQuality.create(videoQuality);
};

const videoQualityRepository = {
  findVideoQuality,
  updateVideoQuality,
  createVideoQuality,
};

export default videoQualityRepository;
