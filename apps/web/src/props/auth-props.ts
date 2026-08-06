import type {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
} from 'react';
  
import {
  ILoginRequestDto,
  IRegisterRequestDto,
} from '../model/auth/auth-model';
  
export interface ILoginViewProps {
    isLogin: boolean;
    loginFormData: ILoginRequestDto;
    registerFormData: IRegisterRequestDto;
  
    handleInputChange: (
      event: ChangeEvent<HTMLInputElement>,
    ) => void;
  
    submitForm: (
      event: React.SubmitEvent<HTMLFormElement>,
    ) => void;
  
    setIsLogin: Dispatch<SetStateAction<boolean>>;
  }