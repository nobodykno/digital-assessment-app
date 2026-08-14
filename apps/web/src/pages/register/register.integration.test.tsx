import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it } from 'vitest';

import { AuthProvider } from '../../context/auth-context';
import Register from './register';





describe('Register integration', () => {
  it('should Register successfully', async () => {
    const user = userEvent.setup();
  
    render(
      <AuthProvider>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </AuthProvider>,
    );


    await user.type(
      screen.getByPlaceholderText('Enter your name'),
      'AdminParamjit',
    );
  
    await user.type(
      screen.getByPlaceholderText('Enter your email'),
      'admin@example.com',
    );
  
    await user.type(
      screen.getByPlaceholderText('Enter your password'),
      'Admin@123',
    );
  
    await user.click(
      screen.getByRole('button', { name: 'Login' }),
    );
  });
});