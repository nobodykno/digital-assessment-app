import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../hooks/useAuth';
import { JwtPayload } from './auth-guard-model';


/**
 * 
 * Auth guard concept 
 */
const AuthGuard = () => {
  const { token, logout } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);

   
    const currentTime = Math.floor(Date.now() / 1000);


    if (decoded.exp <= currentTime) {
      logout();

      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    logout();

    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AuthGuard;