import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../../context/auth-context';
import Register from './register';
import registerService from './register-service';

vi.mock('./register-service', () => ({
  default: {
    register: vi.fn(),
  },
}));


const renderRegister = () => {
  return render(
    <AuthProvider>
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    </AuthProvider>,
  );
};



describe('Register', () => {
  it('should switch to register form', async () => {
    const user = userEvent.setup();

    renderRegister();


    expect(
      screen.getByRole('heading', { name: 'Register' }),
    ).toBeInTheDocument();
  });

  it('should render email input', () => {
    renderRegister();
    expect(
      screen.getByPlaceholderText('Enter your email'),
    ).toBeInTheDocument();
  });

  it('should render Password input', () => {
    renderRegister();
    expect(
      screen.getByPlaceholderText('Enter your password'),
    ).toBeInTheDocument();
  });

  it('should render name input', async () => {
    const user = userEvent.setup();

    renderRegister();   
    
    await user.click(
      screen.getByRole('button', { name: 'Register' }),
    );

    expect(
      screen.getByPlaceholderText('Enter your name'),
    ).toBeInTheDocument();
  });



  it('should allow user to enter name', async () => {
    const user = userEvent.setup();
  
    renderRegister();

    await user.click(
      screen.getByRole('button', { name: 'Register' }),
    );

  
    const nameInput = screen.getByPlaceholderText('Enter your name');
  
    await user.type(nameInput, 'AdminParam');
  
    expect(nameInput).toHaveValue('AdminParam');
  });

  it('should allow user to enter email', async () => {
    const user = userEvent.setup();
  
    renderRegister();
  
    const emailInput = screen.getByPlaceholderText('Enter your email');
  
    await user.type(emailInput, 'admin@example.com');
  
    expect(emailInput).toHaveValue('admin@example.com');
  });

  it('should allow user to enter password', async () => {
    const user = userEvent.setup();
  
    renderRegister();
  
    const passwordInput = screen.getByPlaceholderText('Enter your password');
  
    await user.type(passwordInput, '1234');
  
    expect(passwordInput).toHaveValue('1234');
  });



  it('should call register  service when register form is submitted', async () => {
    const user = userEvent.setup();

    vi.mocked(registerService.register).mockResolvedValue(true);
  
    renderRegister();

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
  
    expect(registerService.register).toHaveBeenCalledWith(
      {
        name: 'AdminParamjit',
        email: 'admin@example.com',
        password: 'Admin@123',
      },
      expect.any(AbortSignal),
    );
  });

});