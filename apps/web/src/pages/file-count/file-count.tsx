import FileCountView from './file-count-view';
import useFileCount from './useFile';


const FileCount = () => {
  const fileCount = useFileCount();
  return <FileCountView folders={fileCount.folders} loading={fileCount.loading} error={fileCount.error}  />;
};

export default FileCount;