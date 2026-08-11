import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it } from 'vitest';

import Login from './login';
import { AuthProvider } from '../../context/auth-context';

describe('Login integration', () => {
  it('should login successfully', async () => {
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthProvider>,
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



describe('Register integration', () => {
  it('should Register successfully', async () => {
    const user = userEvent.setup();
  
    render(
      <AuthProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthProvider>,
    );

    await user.click(
      screen.getByRole('button', { name: 'Register' }),
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