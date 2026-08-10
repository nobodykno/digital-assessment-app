import { DataTypes } from 'sequelize';

import type { QueryInterface } from 'sequelize';

export const up = async ({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> => {
  await queryInterface.createTable('files', {
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
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
    
  });

  await queryInterface.addIndex('files', ['user_id'], {
    name: 'files_user_id',
  });
};

export const down = async ({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> => {
  await queryInterface.dropTable('files');
};
