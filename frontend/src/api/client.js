import axios from 'axios';
import { getAccessToken, getRefreshToken, clearTokens, isTokenExpired } from '../utils/token';

const apiClient = axios.create({

  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false,
  
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token && !isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }
    

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        })
        .catch(err => {
          return Promise.reject(err);
        });
    }
    
    originalRequest._retry = true;
    isRefreshing = true;
    
    try {
      const refreshToken = getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('No refresh token');
      }
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/refresh_token`,
        { refresh_token: refreshToken }
      );
      
      const { access_token } = response.data;
      
      const { getAccessToken } = await import('../utils/token');
      localStorage.setItem('eventhub_access_token', access_token);
      
      originalRequest.headers.Authorization = `Bearer ${access_token}`;
      
      processQueue(null, access_token);
      
      return apiClient(originalRequest);
      
    } catch (refreshError) {
      clearTokens();
      processQueue(refreshError, null);
      
      window.location.href = '/login';
      
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;