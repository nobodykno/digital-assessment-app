import File from './file-model.js';
import FileProcessing from './file-processing-model.js';
import User from './user-model.js';
import VideoQuality from './video-quality-model.js';

/**
 * Association among the models
 */

User.hasMany(File, {
  foreignKey: 'user_id',
  as: 'files',

  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

File.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'owner',
});

File.hasOne(FileProcessing, {
  foreignKey: 'file_id',
  as: 'processing',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

FileProcessing.belongsTo(File, {
  foreignKey: 'file_id',
  as: 'file',
});

File.hasOne(VideoQuality, {
  foreignKey: 'file_id',
  as: 'videoQuality',
});

VideoQuality.belongsTo(File, {
  foreignKey: 'file_id',
  as: 'file',
});
