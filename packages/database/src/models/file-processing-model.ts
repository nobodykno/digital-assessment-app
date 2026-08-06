import { DataTypes, Model } from 'sequelize';



import type {
  IFileProcessingAttributes,
  IFileProcessingCreateAttributes,
} from '../types/file-processing-type.js';
import sequelize from '../config/database.js';

/**
 * File processing model  to store upload Id and status
 */

class FileProcessing
  extends Model<IFileProcessingAttributes, IFileProcessingCreateAttributes>
  implements IFileProcessingAttributes
{
  declare id: number;
  declare file_id: number;
  declare upload_id: string;
  declare status: string;
  declare path: string;
}

FileProcessing.init(
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

    path: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    upload_id: {
      type: DataTypes.STRING(355),
      allowNull: false,
    },

    status: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'file_processing',
    timestamps: false,
  },
);

export default FileProcessing;
