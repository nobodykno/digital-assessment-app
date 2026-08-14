
import { IFile, IPaginationDto } from '../model/file/file-model';

export interface IFileListViewProps {
  loading: boolean;

  files: IFile[];

  pagination: IPaginationDto;

  fileType: string;

  error: string | null;
   
  search: string;

  setSearch: (search: string) => void;

  setPage: (page: number) => void;

  refreshFiles: () => void;
}