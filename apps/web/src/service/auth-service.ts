
import { API } from '../config/api-config';
import { ILoginRequestDto, ILoginResponseDto, IRegisterRequestDto, IRegisterResponseDto } from '../model/auth/auth-model';
import { IHeaderDto } from '../model/http/http-model';
import { httpService } from './base-service';



/**
 * 
 * @param payload 
 * call api to authenticate
 * 
 */

const login = async (payload: ILoginRequestDto, signal: AbortSignal) => {
  const { url, method } = API.AUTH.LOGIN;
  const request: IHeaderDto = {
    url: url,
    method: method,
    isFormData: false,
    requiresAuth: false,
    signal: signal
  };

  return await httpService<ILoginResponseDto>(request,payload);
  
};

/**
 * 
 * @param payload 
 * @returns success when user is registered 
 */

const register = async (payload: IRegisterRequestDto, signal: AbortSignal) => {
  const { url, method } = API.AUTH.REGISTER;

  const request: IHeaderDto = {
    url: url,
    method: method,
    isFormData: false,
    requiresAuth: false,
    signal: signal
  };

  return await httpService<IRegisterResponseDto>(request,payload);
};
  


const authService = {
     
  register,
  login

};

export default authService;

