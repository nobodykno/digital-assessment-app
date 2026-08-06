

import FileUploader from '../../components/file-uploader/file-uploader';
import Pagination from '../../components/file/file-pagination';
import FileTable from '../../components/file/file-table';
import { IFileListViewProps } from '../../props/file-list-view-props';

const FileListView = (props: IFileListViewProps) => {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-[var(--font-size-title)] font-[var(--font-weight-bold)]">
        {props.fileType.charAt(0).toUpperCase() +
          props.fileType.slice(1)}{' '}
        Files
      </h1>

      <div className="mb-6 flex items-center justify-between">
        <FileUploader
          fileType={props.fileType}
          onUploadSuccess={props.refreshFiles}
        />
      </div>

      <FileTable
        files={props.files}
        loading={props.loading}
        fileType={props.fileType}
        refreshFiles={props.refreshFiles}
      />

      <Pagination
        pagination={props.pagination}
        onPageChange={props.setPage}
      />
    </div>
  );
};

export default FileListView;