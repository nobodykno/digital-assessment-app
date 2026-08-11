import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, beforeEach } from 'vitest';

import { AuthProvider } from '../../context/auth-context';
import FileCount from './file-count';

describe('FileList integration', () => {
  beforeEach(() => {
    localStorage.setItem(
      'token',
      'fake-test-token',
    );
  });

  it('should load image files successfully', async () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <FileCount />
        </MemoryRouter>
      </AuthProvider>,
    );

    expect(
      await screen.findByText('5'),
    ).toBeInTheDocument();
  
    expect(
      screen.getByText('3'),
    ).toBeInTheDocument();
  
    expect(
      screen.getByText('2'),
    ).toBeInTheDocument();
  });

  
});