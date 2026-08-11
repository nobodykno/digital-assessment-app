import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Login from './login';
import { AuthProvider } from '../../context/auth-context';

import loginService from './login-service';

vi.mock('./login-service', () => ({
  default: {
    login: vi.fn(),
    register: vi.fn(),
  },
}));


const renderLogin = () => {
  return render(
    <AuthProvider>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </AuthProvider>,
  );
};

describe('Login', () => {
  it('should render Login page', () => {

    renderLogin();

    expect(
      screen.getByRole('heading', { name: 'Login' }),
    ).toBeInTheDocument();
  });

  it('should render email input', () => {
    renderLogin();
    expect(
      screen.getByPlaceholderText('Enter your email'),
    ).toBeInTheDocument();
  });

  it('should render Password input', () => {
    renderLogin();
    expect(
      screen.getByPlaceholderText('Enter your password'),
    ).toBeInTheDocument();
  });

  it('should allow user to enter email', async () => {
    const user = userEvent.setup();
  
    renderLogin();
  
    const emailInput = screen.getByPlaceholderText('Enter your email');
  
    await user.type(emailInput, 'admin@example.com');
  
    expect(emailInput).toHaveValue('admin@example.com');
  });

  it('should allow user to enter password', async () => {
    const user = userEvent.setup();
  
    renderLogin();
  
    const passwordInput = screen.getByPlaceholderText('Enter your password');
  
    await user.type(passwordInput, '1234');
  
    expect(passwordInput).toHaveValue('1234');
  });


  it('should call login service when login form is submitted', async () => {
    const user = userEvent.setup();
  
    vi.mocked(loginService.login).mockResolvedValue(true);
  
    renderLogin();
  
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
  
    await user.type(emailInput, 'admin@example.com');
    await user.type(passwordInput, 'Admin@123');
  
    await user.click(
      screen.getByRole('button', { name: 'Login' }),
    );
  
    expect(loginService.login).toHaveBeenCalledWith(
      {
        email: 'admin@example.com',
        password: 'Admin@123',
      },
      expect.any(Function),
      expect.any(Function),
    );;
  });

});


describe('Register', () => {
  it('should switch to register form', async () => {
    const user = userEvent.setup();

    renderLogin();
    await user.click(
      screen.getByRole('button', { name: 'Register' }),
    );

    expect(
      screen.getByRole('heading', { name: 'Register' }),
    ).toBeInTheDocument();
  });

  it('should render email input', () => {
    renderLogin();
    expect(
      screen.getByPlaceholderText('Enter your email'),
    ).toBeInTheDocument();
  });

  it('should render Password input', () => {
    renderLogin();
    expect(
      screen.getByPlaceholderText('Enter your password'),
    ).toBeInTheDocument();
  });

  it('should render name input', async () => {
    const user = userEvent.setup();

    renderLogin();   
    
    await user.click(
      screen.getByRole('button', { name: 'Register' }),
    );

    expect(
      screen.getByPlaceholderText('Enter your name'),
    ).toBeInTheDocument();
  });



  it('should allow user to enter name', async () => {
    const user = userEvent.setup();
  
    renderLogin();

    await user.click(
      screen.getByRole('button', { name: 'Register' }),
    );

  
    const nameInput = screen.getByPlaceholderText('Enter your name');
  
    await user.type(nameInput, 'AdminParam');
  
    expect(nameInput).toHaveValue('AdminParam');
  });

  it('should allow user to enter email', async () => {
    const user = userEvent.setup();
  
    renderLogin();
  
    const emailInput = screen.getByPlaceholderText('Enter your email');
  
    await user.type(emailInput, 'admin@example.com');
  
    expect(emailInput).toHaveValue('admin@example.com');
  });

  it('should allow user to enter password', async () => {
    const user = userEvent.setup();
  
    renderLogin();
  
    const passwordInput = screen.getByPlaceholderText('Enter your password');
  
    await user.type(passwordInput, '1234');
  
    expect(passwordInput).toHaveValue('1234');
  });



  it('should call login service when register form is submitted', async () => {
    const user = userEvent.setup();

    vi.mocked(loginService.register).mockResolvedValue(true);
  
    renderLogin();

    await user.click(
      screen.getByRole('button', { name: 'Register' }),
    );
  

    const nameInput = screen.getByPlaceholderText('Enter your name');
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');

    await user.type(nameInput, 'AdminParamjit');
    await user.type(emailInput, 'admin@example.com');
    await user.type(passwordInput, 'Admin@123');
  
    await user.click(
      screen.getByRole('button', { name: 'Register' }),
    );
  
    expect(loginService.register).toHaveBeenCalledWith(
      {
        name: 'AdminParamjit',
        email: 'admin@example.com',
        password: 'Admin@123',
      },
    );
  });

});