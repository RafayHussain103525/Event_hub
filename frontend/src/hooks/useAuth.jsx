import { useState, useEffect, useCallback } from 'react';
import { loginUser, loginOrganizer, signupUser, signupOrganizer, logout as apiLogout } from '../api/auth';
import { getUserData, getUserRole, isAuthenticated, clearTokens } from '../utils/token';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (isAuthenticated()) {
          const userData = getUserData();
          const userRole = getUserRole();
          setUser(userData);
          setRole(userRole);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await loginUser(credentials);
      const { account } = response;
      
      setUser(account);
      setRole('user');
      
      return { success: true, user: account };
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginOrganizerUser = useCallback(async (credentials) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await loginOrganizer(credentials);
      const { account } = response;
      
      setUser(account);
      setRole('organizer');
      
      return { success: true, user: account };
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);


  const signup = useCallback(async (userData) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await signupUser(userData);
      
      return { success: true, user: response };
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Signup failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);


  const signupOrganizerUser = useCallback(async (organizerData) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await signupOrganizer(organizerData);
      
      return { success: true, user: response };
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Signup failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
  clearTokens();
  setUser(null);
  setRole(null);
  }, []);

  return {
    user,
    role,
    isLoading,
    error,
    isAuthenticated: !!user,

    login,
    loginOrganizerUser,
    signup,
    signupOrganizerUser,
    logout,
  };
};