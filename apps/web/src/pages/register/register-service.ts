
import { toast } from 'react-toastify';

import { IError } from '../../common/error-model';
import MESSAGES from '../../constants/message';
import {
  IRegisterRequestDto,
} from '../../model/auth/auth-model';
import service from '../../service';
import authValidator from '../../validators/auth-validate-schema';


const register = async (
  request: IRegisterRequestDto,
): Promise<boolean> => {
  const result =
    authValidator.createUserSchema.safeParse(request);

  if (!result.success) {
    result.error.issues.forEach((issue) => {
      toast.error(issue.message);
    });

    return false;
  }

  try {
    await service.authService.register(request);

    toast.success(MESSAGES.AUTH.REGISTER_SUCCESS);

    return true;
  } catch (error) {
    const apiError = error as IError;

    toast.error(
      apiError.message ?? MESSAGES.AUTH.REGISTER_FAILED,
    );

    return false;
  }
};

export default {
  register,
};