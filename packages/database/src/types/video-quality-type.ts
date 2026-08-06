/**
 * Attribute  for video quality attribute
 */

import type { Optional } from 'sequelize';

export interface IVideoQualityAttributes {
  id: number;
  file_id: number;
  hd_quality_path: string;
  high_quality_path: string;
  medium_quality_path: string;
  low_quality_path: string;
}

export type IVideoQualityCreateAttributes = Optional<
  IVideoQualityAttributes,
  | 'id'
  | 'file_id'
  | 'hd_quality_path'
  | 'high_quality_path'
  | 'low_quality_path'
  | 'medium_quality_path'
>;
