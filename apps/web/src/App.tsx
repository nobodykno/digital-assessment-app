import { Navigate, Route, Routes } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import Header from './layout/header';
import Footer from './layout/footer';
;
import ProtectedLayout from './layout/protected-layout';
import LoginInfo from './pages/login/login-view';
import Login from './pages/login/login';


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

            {/* Protected Routes */}
            <Route path="/*" element={<ProtectedLayout />} />

            {/* Default */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default App;
