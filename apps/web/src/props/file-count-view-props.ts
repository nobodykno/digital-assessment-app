import { IFileCountModelResponseDto } from '../model/file/file-model';

export interface FileCountViewProps {
    folders: IFileCountModelResponseDto;
    loading: boolean;
    error: string;
  }