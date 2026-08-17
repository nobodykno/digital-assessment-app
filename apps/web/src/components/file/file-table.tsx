import { formatDate } from '../../handler/date-handler';
import { IFileTableProps } from '../../props/file-table-props';
import ErrorView from '../error-view/error-view';
import DeleteButton from '../file-delete-button/file-delete-button';
import DownloadButton from '../file-download-button/download-button';
import VideoDownload from '../video-download-button/video-download-button';

/**
 * 
 * @param props 
 * @returns file table view
 */
const FileTable = (props: IFileTableProps) => {
  if (props.loading) {
    return <p>Loading...</p>;
  }

  if (props.error) {
    return (
      <ErrorView error={props.error} />
    );
  }
  
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[800px] border-collapse">
        <thead>
          <tr className="border-b">
            {(props.fileType === 'image' || props.fileType === 'video') && (
              <th scope="col" className="p-3 text-left">
                Thumbnail
              </th>
            )}
  
            <th scope="col" className="p-3 text-left">
              File Name
            </th>
  
            <th scope="col" className="p-3 text-left">
              Uploaded Time
            </th>
  
            <th scope="col" className="p-3 text-left">
              Download
            </th>
  
            <th scope="col" className="p-3 text-left">
              Delete
            </th>
          </tr>
        </thead>
  
        <tbody>
          {props.files.map((file) => (
            <tr
              key={file.id}
              className="border-b"
            >
              {(props.fileType === 'image' || props.fileType === 'video') && (
                <td className="p-3">
                  {file.thumbnail_image ? (
                    <img
                      src={file.thumbnail_image}
                      alt={`Thumbnail of ${file.name}`}
                      className="h-12 w-12 rounded object-cover"
                    />
                  ) : (
                    <span aria-live="polite">
                      Generating thumbnail...
                    </span>
                  )}
                </td>
              )}
  
              <td className="p-3">{file.name}</td>
  
              <td className="p-3">
                <time dateTime={file.uploadedAt}>
                  {formatDate(file.uploadedAt)}
                </time>
              </td>
  
              <td className="p-3">
                {props.fileType === 'video' ? (
                  <VideoDownload fileId={file.id} />
                ) : (
                  <DownloadButton fileId={file.id} />
                )}
              </td>
  
              <td className="p-3">
                <DeleteButton
                  fileId={file.id}
                  onDeleteSuccess={props.refreshFiles}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileTable;