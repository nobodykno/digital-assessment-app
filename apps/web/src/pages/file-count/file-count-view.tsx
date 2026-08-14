import { useNavigate } from 'react-router-dom';

import { FileCountViewProps } from '../../props/file-count-view-props';
import FileCountCard from './file-count-card';
import ErrorView from '../../components/error-view/error-view';

const FileCountView = (props: FileCountViewProps) => {
  const navigate = useNavigate();


  if (props.error) {
    return (
       <ErrorView error={props.error} />
    );
  }

  return (
    <div className="p-6">
      <h1
        className="
          mb-2
          text-[var(--font-size-title)]
          font-[var(--font-weight-bold)]
          text-[var(--color-text-primary)]
        "
      >
        Dashboard
      </h1>

      <p
        className="
          mb-6
          text-[var(--font-size-md)]
          text-[var(--color-text-secondary)]
        "
      >
        Choose a folder to manage your files.
      </p>

      {props.loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <FileCountCard
            title="Images"
            count={props.folders.result.images}
            to="/file/image"
          />

          <FileCountCard
            title="Videos"
            count={props.folders.result.videos}
             to="/file/video"
          />

          <FileCountCard
            title="Documents"
            count={props.folders.result.document}
            to="/file/document"
          />
        </div>
      )}
    </div>
  );
};

export default FileCountView;