import { ReactNode } from 'react';

/**
 * Auth Context type
 */
export interface AuthContextType {
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
  }
  
export interface AuthProviderProps{
    children:ReactNode;
  }