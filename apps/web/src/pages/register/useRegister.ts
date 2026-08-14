import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ILoginRequestDto, IRegisterRequestDto } from '../../model/auth/auth-model';

import loginService from './register-service';

/**
 * 
 * Business logic for data 
 */

const useRegister = () => {

  const navigate = useNavigate();
  

  
  const [registerFormData, setRegisterFormData] = useState<IRegisterRequestDto>({
    name: '',
    email: '',
    password: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement >) => {
    setRegisterFormData({ ...registerFormData, [e.target.name]: e.target.value });
  };
  
  const submitForm = async (
    event: React.SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
 
    const registered =
      await loginService.register(
        registerFormData,
      );
  
    if (registered) {
         navigate('/login')
    }
  };

  const navigateLogin = async () =>{
    navigate('/login')
  }


  return {
    registerFormData,
    submitForm,
    handleInputChange,
    navigateLogin
  };
};
export default useRegister;