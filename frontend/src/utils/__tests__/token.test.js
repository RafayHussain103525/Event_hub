import {
  storeTokens,
  getAccessToken,
  getRefreshToken,
  getUserData,
  getUserRole,
  isAuthenticated,
  clearTokens,
  isTokenExpired,
} from '../token';
import { mockUser } from '../../test/helpers';

describe('token utilities', () => {
  describe('storeTokens', () => {
    it('stores all tokens and user data in localStorage', () => {
      storeTokens(
        'access-token-123',
        'refresh-token-456',
        mockUser,
        'user'
      );

      expect(localStorage.getItem('eventhub_access_token')).toBe(
        'access-token-123'
      );
      expect(localStorage.getItem('eventhub_refresh_token')).toBe(
        'refresh-token-456'
      );
      expect(localStorage.getItem('eventhub_user_role')).toBe('user');
      const storedUser = JSON.parse(
        localStorage.getItem('eventhub_user_data')
      );
      expect(storedUser).toEqual(mockUser);
    });
  });

  describe('getAccessToken', () => {
    it('returns null when no token stored', () => {
      expect(getAccessToken()).toBeNull();
    });

    it('returns stored token', () => {
      localStorage.setItem('eventhub_access_token', 'my-token');
      expect(getAccessToken()).toBe('my-token');
    });
  });

  describe('getRefreshToken', () => {
    it('returns null when no token stored', () => {
      expect(getRefreshToken()).toBeNull();
    });

    it('returns stored token', () => {
      localStorage.setItem('eventhub_refresh_token', 'refresh-abc');
      expect(getRefreshToken()).toBe('refresh-abc');
    });
  });

  describe('getUserData', () => {
    it('returns null when no user data stored', () => {
      expect(getUserData()).toBeNull();
    });

    it('returns parsed user data object', () => {
      localStorage.setItem('eventhub_user_data', JSON.stringify(mockUser));
      expect(getUserData()).toEqual(mockUser);
    });

    it('handles malformed JSON gracefully', () => {
      localStorage.setItem('eventhub_user_data', 'invalid-json{{{');
      expect(getUserData()).toBeNull();
    });
  });

  describe('getUserRole', () => {
    it('returns null when no role stored', () => {
      expect(getUserRole()).toBeNull();
    });

    it('returns stored role', () => {
      localStorage.setItem('eventhub_user_role', 'organizer');
      expect(getUserRole()).toBe('organizer');
    });
  });

  describe('isAuthenticated', () => {
    it('returns false when no access token', () => {
      expect(isAuthenticated()).toBe(false);
    });

    it('returns true when access token exists', () => {
      localStorage.setItem('eventhub_access_token', 'token');
      expect(isAuthenticated()).toBe(true);
    });
  });

  describe('clearTokens', () => {
    it('removes all stored data from localStorage', () => {
      storeTokens('access', 'refresh', mockUser, 'user');

      clearTokens();

      expect(localStorage.getItem('eventhub_access_token')).toBeNull();
      expect(localStorage.getItem('eventhub_refresh_token')).toBeNull();
      expect(localStorage.getItem('eventhub_user_data')).toBeNull();
      expect(localStorage.getItem('eventhub_user_role')).toBeNull();
    });
  });

  describe('isTokenExpired', () => {
    it('returns true for null/undefined token', () => {
      expect(isTokenExpired(null)).toBe(true);
      expect(isTokenExpired(undefined)).toBe(true);
    });

    it('returns true for malformed token', () => {
      expect(isTokenExpired('not-a-jwt')).toBe(true);
    });

    it('returns true for expired token', () => {
      const payload = { exp: Math.floor(Date.now() / 1000) - 3600 };
      const header = btoa(JSON.stringify({ alg: 'HS256' }));
      const encodedPayload = btoa(JSON.stringify(payload));
      const token = `${header}.${encodedPayload}.signature`;

      expect(isTokenExpired(token)).toBe(true);
    });

    it('returns false for future-dated token', () => {
      const payload = { exp: Math.floor(Date.now() / 1000) + 3600 };
      const header = btoa(JSON.stringify({ alg: 'HS256' }));
      const encodedPayload = btoa(JSON.stringify(payload));
      const token = `${header}.${encodedPayload}.signature`;

      expect(isTokenExpired(token)).toBe(false);
    });
  });
});