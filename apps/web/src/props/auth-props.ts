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
    loginFormData: ILoginRequestDto;
    navigateRegister: () => void;
    handleInputChange: (
      event: ChangeEvent<HTMLInputElement>,
    ) => void;
  
    submitForm: (
      event: React.SubmitEvent<HTMLFormElement>,
    ) => void;

  }

  export interface IRegisterViewProps {
    registerFormData: IRegisterRequestDto;
    navigateLogin: () => void;
  
    handleInputChange: (
      event: ChangeEvent<HTMLInputElement>,
    ) => void;
  
    submitForm: (
      event: React.SubmitEvent<HTMLFormElement>,
    ) => void;
  
  }