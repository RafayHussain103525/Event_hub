import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { useAuthContext } from '../../context/AuthContext';
import { mockUser } from '../helpers';
vi.mock('../../api/auth', () => ({
  loginUser: vi.fn(),
  loginOrganizer: vi.fn(),
  signupUser: vi.fn(),
  signupOrganizer: vi.fn(),
  logout: vi.fn(),
}));

import { loginUser, logout as apiLogout } from '../../api/auth';
const AuthStateDisplay = () => {
  const { user, role, isAuthenticated, logout } = useAuthContext();

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <span data-testid="auth-status">Logged in</span>
          <span data-testid="user-email">{user?.email}</span>
          <span data-testid="user-role">{role}</span>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <span data-testid="auth-status">Logged out</span>
          <button
            onClick={() =>
              loginUser({ email: 'test@example.com', password: 'password' })
            }
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
};

const renderWithAuth = () => {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <AuthStateDisplay />
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('Authentication Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('starts as logged out', () => {
    renderWithAuth();

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged out');
  });

  it('can login and state updates', async () => {
    const user = userEvent.setup();

    loginUser.mockResolvedValue({
      access_token: 'access-token',
      refresh_token: 'refresh-token',
      account: mockUser,
    });

    renderWithAuth();
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
      });
    });
  });

  it('restores auth state from localStorage on mount', async () => {
    localStorage.setItem('eventhub_access_token', 'stored-token');
    localStorage.setItem(
      'eventhub_user_data',
      JSON.stringify(mockUser)
    );
    localStorage.setItem('eventhub_user_role', 'user');

    renderWithAuth();

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'Logged in'
      );
      expect(screen.getByTestId('user-email')).toHaveTextContent(
        'test@example.com'
      );
      expect(screen.getByTestId('user-role')).toHaveTextContent('user');
    });
  });

  it('clears auth state when logging out', async () => {
    const user = userEvent.setup();
    localStorage.setItem('eventhub_access_token', 'stored-token');
    localStorage.setItem(
      'eventhub_user_data',
      JSON.stringify(mockUser)
    );
    localStorage.setItem('eventhub_user_role', 'user');

    renderWithAuth();

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged in');
    });

    await user.click(screen.getByRole('button', { name: /logout/i }));

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'Logged out'
      );
    });

    expect(localStorage.getItem('eventhub_access_token')).toBeNull();
    expect(localStorage.getItem('eventhub_user_data')).toBeNull();
  });
});