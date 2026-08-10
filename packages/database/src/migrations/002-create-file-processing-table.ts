import { DataTypes } from 'sequelize';

import type { QueryInterface } from 'sequelize';

export const up = async ({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> => {
  await queryInterface.createTable('file_processing', {
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
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
    
  });

  await queryInterface.addIndex('file_processing', ['file_id'], {
    name: 'file_processing_file_id_idx',
    unique: true,
  });

  await queryInterface.addIndex('file_processing', ['upload_id'], {
    name: 'file_processing_upload_id_idx',
  });
};

export const down = async ({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> => {
  await queryInterface.dropTable('file_processing');
};
