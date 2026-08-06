import { Navigate, Route, Routes } from 'react-router-dom';
import AuthGuard from '../guard/auth-guard';
import FileCount from '../pages/file-count/file-count';
import FileList from '../pages/file-list/file-list';

/**
 * 
 * @returns protected layout option
 */

const ProtectedLayout = () => {
  return (
    <div className="flex h-screen flex-col">

      <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
        <Routes>
          <Route element={<AuthGuard />}>
            <Route path="/" element={<Navigate to="/file" replace />} />
            <Route path="/file/:fileType" element={<FileList/>} />
            <Route path="/file" element={<FileCount />} />
          </Route>
        </Routes>
      </main>

    </div>
  );
};

export default ProtectedLayout;