import { Navigate, Route, Routes } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import Header from './layout/header';
import Footer from './layout/footer';
import ProtectedLayout from './layout/protected-layout';
import AuthGuard from './guard/auth-guard';

import Login from './pages/login/login';
import FileCount from './pages/file-count/file-count';
import FileList from './pages/file-list/file-list';
import NotFound from './pages/not-found/not-found';
import Register from './pages/register/register';

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />

      <div className="flex h-screen flex-col">
        <Header />

        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />

            {/* Public Route */}
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route element={<AuthGuard />}>
              <Route element={<ProtectedLayout />}>
                <Route
                  path="/"
                  element={<Navigate to="/file" replace />}
                />

                <Route
                  path="/file"
                  element={<FileCount />}
                />

                <Route
                  path="/file/:fileType"
                  element={<FileList />}
                />

                {/* Unknown authenticated routes */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Route>
          </Routes>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default App;