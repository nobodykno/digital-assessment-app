import { DataTypes, Model } from 'sequelize';



import type File from './file-model.js';
import type { ICreateUserRequestDto, IUserAttributes } from '../types/user-type.js';
import type {
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
} from 'sequelize';
import sequelize from '../config/database.js';

/**
 * User model to store user details
 */

class User extends Model<IUserAttributes, ICreateUserRequestDto> implements IUserAttributes {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;

  declare getFiles: HasManyGetAssociationsMixin<File>;

  declare countFiles: HasManyCountAssociationsMixin;

  declare createFiles: HasManyCreateAssociationMixin<File>;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'users',
  },
);

export default User;
