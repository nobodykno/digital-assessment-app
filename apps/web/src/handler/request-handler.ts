

/**
 * 
 * @param response interceptor code
 * @returns 
 */
const handleResponse = async <T>(
  response: Response,
  requireAuth: boolean
): Promise<T> => {
  if (response.status === 401 && requireAuth) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  
  const data= await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong!');
  }
  
  return (data.data ?? data) as T;
};
  
export default handleResponse;