import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ILoginRequestDto, IRegisterRequestDto } from '../../model/auth/auth-model';

import loginService from './login-service';
import { toast } from 'react-toastify';

/**
 * 
 * Business logic for data 
 */

const useLogin = () => {

  const { login } = useAuth();
  
  const navigate = useNavigate();

  const controllerRef = useRef<AbortController | null>(null);
  
  const [loginFormData, setLogInFormData] =  useState<ILoginRequestDto>({
    email: '',
    password: '',
  });
  

  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement >) => {
    setLogInFormData({ ...loginFormData, [e.target.name]: e.target.value });
  };
  
  const submitForm = async (
    event: React.SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    controllerRef.current?.abort();

    const controller = new AbortController();
    controllerRef.current = controller;


    try {
      await loginService.login(
        loginFormData,
        controller.signal,
        login,
        navigate,
      );
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === 'AbortError'
      ) {
        toast.error("Login Request cancelled")
        return;
      }

      throw error;
    }
  };

  const navigateRegister = async () =>{
    navigate('/register')
  }


  return {
    loginFormData,
    navigateRegister,
    submitForm,
    handleInputChange,
  };
};
export default useLogin;