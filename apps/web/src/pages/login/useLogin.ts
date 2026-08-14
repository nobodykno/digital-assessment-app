import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ILoginRequestDto, IRegisterRequestDto } from '../../model/auth/auth-model';

import loginService from './login-service';

/**
 * 
 * Business logic for data 
 */

const useLogin = () => {

  const { login } = useAuth();
  
  const navigate = useNavigate();
  
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
  
    await loginService.login(
      loginFormData,
      login,
      navigate,
    );
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