import handleResponse from '../handler/request-handler';
import { IHeaderDto } from '../model/http/http-model';





const getToken = (): string | null => {
  return localStorage.getItem('token');
};
  
const getHeaders = (isFormData: boolean = false, body:BodyInit) => {
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${getToken()}`);
   
  if (!isFormData) {
    headers.append('Content-Type', 'application/json');
  }
  else{
    if (body instanceof ArrayBuffer) {
      headers.append('Content-Type', 'application/octet-stream');
    } 
  }


  return headers;
};
  

export const httpService = async <T>(
  request: IHeaderDto,
  body?: any
): Promise<T> => {
  const options: RequestInit = {
    method: request.method,
    headers: getHeaders(request.isFormData,body),
  };

  if (body) {
    options.body = request.isFormData
      ? body as BodyInit
      : JSON.stringify(body);
  }

  const response = await fetch(request.url, options);

  return handleResponse<T>(response);
};

