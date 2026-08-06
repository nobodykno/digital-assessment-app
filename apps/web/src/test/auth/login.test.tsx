import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock the hook BEFORE importing the component
const loginMock = vi.fn();

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    login: loginMock,
    logout: vi.fn(),
    isAuthenticated: false,
  }),
}));

import LoginInfo from '../../pages/login/login-view';

describe('LoginInfo', () => {
  test('renders login form by default', () => {
    render(
      <MemoryRouter>
        <LoginInfo />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: /login/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/email/i),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/password/i),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /^login$/i }),
    ).toBeInTheDocument();

    expect(
      screen.queryByLabelText(/name/i),
    ).not.toBeInTheDocument();
  });
});