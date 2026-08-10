import { DataTypes } from 'sequelize';

import type { QueryInterface } from 'sequelize';

export const up = async ({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> => {
  await queryInterface.createTable('video_quality', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    file_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'files',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },

    hd_quality_path: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    high_quality_path: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    medium_quality_path: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    low_quality_path: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  });

  await queryInterface.addIndex('video_quality', ['file_id'], {
    name: 'video_quality_file_id_idx',
    unique: true,
  });
};

export const down = async ({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> => {
  await queryInterface.dropTable('video_quality');
};
