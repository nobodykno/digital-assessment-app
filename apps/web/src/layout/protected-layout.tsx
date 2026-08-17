import { Outlet } from 'react-router-dom';


/**
 * 
 * @returns protected layout option
 */

const ProtectedLayout = () => {
  return (
    <div className="flex h-screen flex-col">

      <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
        <Outlet />
      </main>

    </div>
  );
};

export default ProtectedLayout;