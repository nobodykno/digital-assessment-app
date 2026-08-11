import { setupServer } from 'msw/node';
import { loginHandlers } from '../pages/login/login-handler';



export const server = setupServer(
  ...loginHandlers,
);