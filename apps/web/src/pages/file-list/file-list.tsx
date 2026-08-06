import { useParams } from 'react-router-dom';

import useFileList from './useFile';
import FileListView from './file-list-view';




const FileList = () => {
  
  const params = useParams();
  const fileType = params.fileType;

  const fileList = useFileList(fileType!);


  return <FileListView {...fileList} />;
};

export default FileList;