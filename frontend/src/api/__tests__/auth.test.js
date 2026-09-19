import { describe, it, expect, vi, beforeEach } from 'vitest';
vi.mock('../client', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

import apiClient from '../client';
import {
  signupUser,
  signupOrganizer,
  loginUser,
  loginOrganizer,
  logout,
  refreshToken,
  checkAuthStatus,
  getCurrentUser,
  getCurrentUserRole,
} from '../auth';
import { mockUser, mockOrganizer } from '../../test/helpers';

describe('auth API functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('signupUser', () => {
    it('calls POST /auth/signup/user with correct data', async () => {
      const userData = {
        username: 'newuser',
        email: 'new@example.com',
        phone_number: '03001234567',
        password: 'password123',
      };

      const mockResponse = { data: { id: 1, ...userData } };
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await signupUser(userData);

      expect(apiClient.post).toHaveBeenCalledWith(
        '/auth/signup/user',
        userData
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('propagates errors', async () => {
      const error = new Error('Email already exists');
      error.response = { data: { detail: 'User with this email already exists' } };
      apiClient.post.mockRejectedValue(error);

      await expect(
        signupUser({ email: 'existing@example.com' })
      ).rejects.toThrow();
    });
  });

  describe('signupOrganizer', () => {
    it('calls POST /auth/signup/organizer', async () => {
      const organizerData = {
        name: 'Test Org',
        email: 'org@example.com',
        phone_number: '03001234567',
        password: 'password123',
      };

      apiClient.post.mockResolvedValue({ data: { id: 1 } });

      await signupOrganizer(organizerData);

      expect(apiClient.post).toHaveBeenCalledWith(
        '/auth/signup/organizer',
        organizerData
      );
    });
  });

  describe('loginUser', () => {
    it('calls POST /auth/login/user and stores tokens', async () => {
      const credentials = { email: 'test@example.com', password: 'password' };
      const mockResponse = {
        data: {
          access_token: 'access-token',
          refresh_token: 'refresh-token',
          account: mockUser,
        },
      };
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await loginUser(credentials);

      expect(apiClient.post).toHaveBeenCalledWith(
        '/auth/login/user',
        credentials
      );
      expect(localStorage.getItem('eventhub_access_token')).toBe(
        'access-token'
      );
      expect(localStorage.getItem('eventhub_refresh_token')).toBe(
        'refresh-token'
      );
      expect(localStorage.getItem('eventhub_user_role')).toBe('user');

      // Verify response data is returned
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('loginOrganizer', () => {
    it('calls POST /auth/login/organizer and stores organizer role', async () => {
      const credentials = {
        email: 'organizer@example.com',
        password: 'password',
      };
      const mockResponse = {
        data: {
          access_token: 'access-token',
          refresh_token: 'refresh-token',
          account: mockOrganizer,
        },
      };
      apiClient.post.mockResolvedValue(mockResponse);

      await loginOrganizer(credentials);

      expect(localStorage.getItem('eventhub_user_role')).toBe('organizer');
    });
  });

  describe('logout', () => {
    it('clears all tokens from localStorage', () => {
      localStorage.setItem('eventhub_access_token', 'token');
      localStorage.setItem('eventhub_refresh_token', 'refresh');
      localStorage.setItem('eventhub_user_data', JSON.stringify(mockUser));
      localStorage.setItem('eventhub_user_role', 'user');

      logout();

      expect(localStorage.getItem('eventhub_access_token')).toBeNull();
      expect(localStorage.getItem('eventhub_refresh_token')).toBeNull();
      expect(localStorage.getItem('eventhub_user_data')).toBeNull();
      expect(localStorage.getItem('eventhub_user_role')).toBeNull();
    });
  });

  describe('refreshToken', () => {
    it('throws error when no refresh token stored', async () => {
      localStorage.clear();

      await expect(refreshToken()).rejects.toThrow(
        'No refresh token available'
      );
    });

    it('calls POST /auth/refresh_token with stored token', async () => {
      localStorage.setItem('eventhub_refresh_token', 'stored-refresh-token');

      const mockResponse = {
        data: { access_token: 'new-access-token', token_type: 'bearer' },
      };
      apiClient.post.mockResolvedValue(mockResponse);

      await refreshToken();

      expect(apiClient.post).toHaveBeenCalledWith('/auth/refresh_token', {
        refresh_token: 'stored-refresh-token',
      });
    });
  });

  describe('checkAuthStatus', () => {
    it('returns false when no token', () => {
      expect(checkAuthStatus()).toBe(false);
    });

    it('returns true when token exists', () => {
      localStorage.setItem('eventhub_access_token', 'token');
      expect(checkAuthStatus()).toBe(true);
    });
  });

  describe('getCurrentUser', () => {
    it('returns stored user data', () => {
      localStorage.setItem(
        'eventhub_user_data',
        JSON.stringify(mockUser)
      );
      expect(getCurrentUser()).toEqual(mockUser);
    });
  });

  describe('getCurrentUserRole', () => {
    it('returns stored role', () => {
      localStorage.setItem('eventhub_user_role', 'organizer');
      expect(getCurrentUserRole()).toBe('organizer');
    });
  });
});