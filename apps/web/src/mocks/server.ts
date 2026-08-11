import { setupServer } from 'msw/node';
import { loginHandlers } from '../pages/login/login-handler';

import { fileCountHandlers } from '../pages/file-count/file-count-handler';
import { fileHandlers } from '../pages/file-list/file-list-handler';



export const server = setupServer(
  ...loginHandlers,
  ...fileHandlers,
  ...fileCountHandlers
);