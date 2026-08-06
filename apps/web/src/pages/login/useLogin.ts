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
  const [isLogin, setIsLogin] = useState(true);

  const { login } = useAuth();
  
  const navigate = useNavigate();
  
  const [loginFormData, setLogInFormData] =  useState<ILoginRequestDto>({
    email: '',
    password: '',
  });
  
  const [registerFormData, setRegisterFormData] = useState<IRegisterRequestDto>({
    name: '',
    email: '',
    password: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement >) => {
    if(isLogin){
      setLogInFormData({ ...loginFormData, [e.target.name]: e.target.value });
    }
    else{
      setRegisterFormData({ ...registerFormData, [e.target.name]: e.target.value });
    }
  };
  
  const submitForm = async (
    event: React.SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
  
    if (isLogin) {
      await loginService.login(
        loginFormData,
        login,
        navigate,
      );
  
      return;
    }
  
    const registered =
      await loginService.register(
        registerFormData,
      );
  
    if (registered) {
      setIsLogin(true);
    }
  };


  return {
    isLogin,
    loginFormData,
    registerFormData,
    submitForm,
    handleInputChange,
    setIsLogin,
  };
};
export default useLogin;