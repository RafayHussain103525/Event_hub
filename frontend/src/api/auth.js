import apiClient from './client';
import { storeTokens, clearTokens, getUserData, getUserRole, isAuthenticated } from '../utils/token';

export const signupUser = async (userData) => {
  const response = await apiClient.post('/auth/signup/user', userData);
  return response.data;
};

export const signupOrganizer = async (organizerData) => {
  const response = await apiClient.post('/auth/signup/organizer', organizerData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await apiClient.post('/auth/login/user', credentials);
  const { access_token, refresh_token, account } = response.data;

  storeTokens(access_token, refresh_token, account, 'user');
  
  return response.data;
};

export const loginOrganizer = async (credentials) => {
  const response = await apiClient.post('/auth/login/organizer', credentials);
  const { access_token, refresh_token, account } = response.data;

  storeTokens(access_token, refresh_token, account, 'organizer');
  
  return response.data;
};

export const logout = () => {
  clearTokens();
};

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem('eventhub_refresh_token');
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  
  const response = await apiClient.post('/auth/refresh_token', {
    refresh_token: refreshToken
  });
  
  return response.data;
};

export const checkAuthStatus = () => {
  return isAuthenticated();
};

export const getCurrentUser = () => {
  return getUserData();
};

export const getCurrentUserRole = () => {
  return getUserRole();
};