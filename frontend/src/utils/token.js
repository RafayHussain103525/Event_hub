const TOKEN_KEYS = {
  ACCESS_TOKEN: 'eventhub_access_token',
  REFRESH_TOKEN: 'eventhub_refresh_token',
  USER_DATA: 'eventhub_user_data',
  USER_ROLE: 'eventhub_user_role',
};

export const storeTokens = (accessToken, refreshToken, userData, role) => {
  localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
  localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken);
  localStorage.setItem(TOKEN_KEYS.USER_DATA, JSON.stringify(userData));
  localStorage.setItem(TOKEN_KEYS.USER_ROLE, role);
};

export const getAccessToken = () => {
  return localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
};

export const getRefreshToken = () => {
  return localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
};

export const getUserData = () => {
  const userData = localStorage.getItem(TOKEN_KEYS.USER_DATA);
  return userData ? JSON.parse(userData) : null;
};

export const getUserRole = () => {
  return localStorage.getItem(TOKEN_KEYS.USER_ROLE);
};

export const isAuthenticated = () => {
  return !!getAccessToken();
};

export const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(TOKEN_KEYS.USER_DATA);
  localStorage.removeItem(TOKEN_KEYS.USER_ROLE);
};

export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
};