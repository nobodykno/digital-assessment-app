import FileCountView from './file-count-view';
import useFile from './useFile';


const FileCount = () => {
  const fileCount = useFile();
  return <FileCountView folders={fileCount.folders} loading={fileCount.loading}  />;
};

export default FileCount;