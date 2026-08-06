
import { API } from '../config/api-config';
import { ILoginRequestDto, ILoginResponseDto, IRegisterRequestDto, IRegisterResponseDto } from '../model/auth/auth-model';



/**
 * 
 * @param payload 
 * call api to authenticate
 * 
 */

const login = async (payload: ILoginRequestDto) => {
  const { url, method } = API.AUTH.LOGIN;

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  
  const data: ILoginResponseDto = await response.json();

  const result:ILoginResponseDto = {
    token: data.token,
    message: data.message
  };
  
  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }
  
  return result;
};

/**
 * 
 * @param payload 
 * @returns success when user is registered 
 */

const register = async (payload: IRegisterRequestDto) => {
  const { url, method } = API.AUTH.REGISTER;
  
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
    
  const data: IRegisterResponseDto = await response.json();
  
  const result:IRegisterResponseDto = {
    message: data.message,
    result: data.result
  };
    
  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }
    
  return result;
};
  


const authService = {
     
  register,
  login

};

export default authService;

