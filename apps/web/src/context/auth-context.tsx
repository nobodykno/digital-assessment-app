import { createContext, useEffect, useState } from 'react';
import { AuthContextType, AuthProviderProps } from './context-model';


/**
 * Context to store value of auth
 */

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

/**
 * Context to store value of auth
 */

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Initialize from localStorage
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  const login = (token: string) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setToken(null);
  };

  useEffect(() => {
    if (!token) {
      return;
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
