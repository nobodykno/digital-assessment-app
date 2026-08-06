
import { IFile, IPaginationDto } from '../model/file/file-model';

export interface IFileListViewProps {
  loading: boolean;

  files: IFile[];

  pagination: IPaginationDto;

  fileType: string;


  setPage: (page: number) => void;

  refreshFiles: () => void;
}