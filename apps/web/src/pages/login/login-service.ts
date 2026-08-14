import { NavigateFunction } from 'react-router-dom';
import { toast } from 'react-toastify';

import { IError } from '../../common/error-model';
import MESSAGES from '../../constants/message';
import {
  ILoginRequestDto,
} from '../../model/auth/auth-model';
import service from '../../service';
import authValidator from '../../validators/auth-validate-schema';

const login = async (
  request: ILoginRequestDto,
  loginContext: (token: string) => void,
  navigate: NavigateFunction,
): Promise<boolean> => {
  const result = authValidator.loginSchema.safeParse(request);

  if (!result.success) {
    result.error.issues.forEach((issue) => {
      toast.error(issue.message);
    });

    return false;
  }

  try {
    const response = await service.authService.login(request);

    loginContext(response.token);

    navigate('/file');

    toast.success(MESSAGES.AUTH.LOGIN_SUCCESS);

    return true;
  } catch (error) {
    const apiError = error as IError;

    toast.error(
      apiError.message ?? MESSAGES.AUTH.LOGIN_FAILED,
    );

    return false;
  }
};



export default {
  login,
};