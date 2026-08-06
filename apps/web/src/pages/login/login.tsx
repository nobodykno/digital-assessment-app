import LoginView from './login-view';
import useLogin from './useLogin';


/**
 * 
 * Login page generation
 */
const Login = () => {
  const login = useLogin();
  console.log('login object:', login);

  return <LoginView {...login} />;
};

export default Login;