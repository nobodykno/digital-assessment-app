import type { Optional } from 'sequelize';

export interface IFileAttributes {
  id: number;
  user_id: number;
  name: string;
  file_name: string;
  size: number;
  mime_type: string;
  path: string;
  uploadedAt: Date;
  thumbnail_image: string;
  status: string;
  type: string;
}

export type IFileCreationAttributes = Optional<
  IFileAttributes,
  'id' | 'uploadedAt' | 'mime_type' | 'thumbnail_image' | 'status' | 'type'
>;
