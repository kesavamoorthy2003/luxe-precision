import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('luxe_token') || localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle 401 Unauthorized
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    const isLoginPage = window.location.pathname === '/login';
    
    // Clear all possible auth tokens
    const authKeys = ['accessToken', 'refreshToken', 'luxe_user', 'luxe_token'];
    authKeys.forEach(key => localStorage.removeItem(key));
    
    // Only redirect if not already on login page to avoid infinite reload loop
    if (!isLoginPage) {
      window.location.href = '/login'; 
    } else {
      // If we are on login page, we might want to reload once to clear React state
      // but only if we actually cleared something to avoid loops.
      // However, usually clearing localStorage is enough for the NEXT action.
      // To be safe and stop the "blinking", we just stop here.
    }
  }
  return Promise.reject(error);
});

export default api;
