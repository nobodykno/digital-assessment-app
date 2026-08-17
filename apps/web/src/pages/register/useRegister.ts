import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ILoginRequestDto, IRegisterRequestDto } from '../../model/auth/auth-model';

import loginService from './register-service';
import { toast } from 'react-toastify';

/**
 * 
 * Business logic for data 
 */

const useRegister = () => {

  const navigate = useNavigate();
  
  const controllerRef = useRef<AbortController | null>(null);
  
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
    controllerRef.current?.abort();

    const controller = new AbortController();
    controllerRef.current = controller;
    try{

      const registered =
      await loginService.register(
        registerFormData,
        controller.signal
      );

      if (registered) {
        navigate('/login');
      }
    } catch (error) {
      if (
        error instanceof DOMException &&
              error.name === 'AbortError'
      ) {
        toast.error('Login Request cancelled');
        return;
      }
      
      throw error;
    }
  

  };

  const navigateLogin = async () =>{
    navigate('/login');
  };


  return {
    registerFormData,
    submitForm,
    handleInputChange,
    navigateLogin
  };
};
export default useRegister;