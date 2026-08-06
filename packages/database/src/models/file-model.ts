import { DataTypes, Model } from 'sequelize';



import type { IFileAttributes, IFileCreationAttributes } from '../types/file-type.js';
import sequelize from '../config/database.js';

/**
 * File model to take file data
 */

class File extends Model<IFileAttributes, IFileCreationAttributes> implements IFileAttributes {
  declare id: number;
  declare user_id: number;
  declare name: string;
  declare file_name: string;
  declare size: number;
  declare mime_type: string;
  declare path: string;
  declare uploadedAt: Date;
  declare thumbnail_image: string;
  declare status: string;
  declare type: string;
}

File.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    thumbnail_image: {
      type: DataTypes.STRING(355),
      allowNull: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },

    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    file_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    size: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    mime_type: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    path: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    type: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    status: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    uploadedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'files',
    timestamps: false,
  },
);

export default File;
