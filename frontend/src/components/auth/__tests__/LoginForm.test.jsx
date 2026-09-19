import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '../LoginForm';

vi.mock('../../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../../../hooks/useAuth';
import { mockUser } from '../../../test/helpers';

const renderLoginForm = () => {
  return render(
    <BrowserRouter>
      <LoginForm />
    </BrowserRouter>
  );
};

describe('LoginForm', () => {
  const mockLogin = vi.fn();
  const mockLoginOrganizer = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      user: null,
      role: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      login: mockLogin,
      loginOrganizerUser: mockLoginOrganizer,
      signup: vi.fn(),
      signupOrganizerUser: vi.fn(),
      logout: vi.fn(),
    });
  });

  it('renders email and password inputs', () => {
    renderLoginForm();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('renders user/organizer toggle buttons', () => {
    renderLoginForm();

    expect(screen.getByRole('button', { name: /user/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /organizer/i })
    ).toBeInTheDocument();
  });

  it('renders submit button', () => {
    renderLoginForm();

    expect(
      screen.getByRole('button', { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it('shows validation error when fields are empty', async () => {
    const user = userEvent.setup();
    renderLoginForm();
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/please fill in all fields/i)
      ).toBeInTheDocument();
    });

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('calls login function with correct credentials', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue({ success: true, user: mockUser });

    renderLoginForm();

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('switches to organizer login when organizer button clicked', async () => {
    const user = userEvent.setup();
    mockLoginOrganizer.mockResolvedValue({ success: true });

    renderLoginForm();

    await user.click(screen.getByRole('button', { name: /organizer/i }));

    await user.type(screen.getByLabelText(/email/i), 'org@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLoginOrganizer).toHaveBeenCalledWith({
        email: 'org@example.com',
        password: 'password123',
      });
    });
  });

  it('displays error message when login fails', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue({
      success: false,
      error: 'Invalid email or password',
    });

    renderLoginForm();
    await user.type(screen.getByLabelText(/email/i), 'wrong@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/invalid email or password/i)
      ).toBeInTheDocument();
    });
  });

  it('shows loading state during submission', async () => {
    const user = userEvent.setup();
    let resolveLogin;
    mockLogin.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveLogin = resolve;
        })
    );

    renderLoginForm();
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText(/signing in/i)).toBeInTheDocument();
    resolveLogin({ success: true, user: mockUser });

    await waitFor(() => {
      expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    });
  });
});