import type { Optional } from 'sequelize';

/**
 * Attribute  file processing attribute
 */
export interface IFileProcessingAttributes {
  id: number;
  file_id: number;
  upload_id: string;
  status: string;
  path: string;
}

export type IFileProcessingCreateAttributes = Optional<
  IFileProcessingAttributes,
  'id' | 'upload_id'
>;
