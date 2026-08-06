import { IFile } from '../model/file/file-model';

export interface IFileTableProps {
    files: IFile[];
    loading: boolean;
    fileType: string;
    refreshFiles: () => void;
  }