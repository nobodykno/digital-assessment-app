import { IPaginationDto } from '../model/file/file-model';

export interface IPaginationProps {
  pagination: IPaginationDto;
  onPageChange: (page: number) => void;
}