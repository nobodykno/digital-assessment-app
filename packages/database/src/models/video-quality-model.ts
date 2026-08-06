import { DataTypes, Model } from 'sequelize';


import type {
  IVideoQualityAttributes,
  IVideoQualityCreateAttributes,
} from '../types/video-quality-type.js';
import sequelize from '../config/database.js';

/**
 * Store video quality for files
 */

class VideoQuality
  extends Model<IVideoQualityAttributes, IVideoQualityCreateAttributes>
  implements IVideoQualityAttributes
{
  declare id: number;
  declare file_id: number;
  declare hd_quality_path: string;
  declare medium_quality_path: string;
  declare low_quality_path: string;
  declare high_quality_path: string;
}

VideoQuality.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    file_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'files',
        key: 'id',
      },
    },

    hd_quality_path: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    high_quality_path: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    low_quality_path: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    medium_quality_path: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'video_quality',
    timestamps: false,
  },
);

export default VideoQuality;
