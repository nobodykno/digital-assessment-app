import { useContext } from 'react';
import { AuthContext } from '../context/auth-context';
import MESSAGES from '../constants/message';

/**
 * 
 * useAuth business logic to store token
 */

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error(MESSAGES.AUTH.AUTH_VALUE_MISSING);
  }
  
  return context;
};