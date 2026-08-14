import RegisterView from './register-view';
import useRegister from './useRegister';



/**
 * 
 * Login page generation
 */
const Register = () => {
  const register = useRegister();
 

  return <RegisterView {...register} />;
};

export default Register;