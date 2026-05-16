// Mock for axiosInstance that uses import.meta.env
// This mock includes interceptors that call the mocked getToken, setToken, etc.
// Note: When axios is mocked in tests, this will use the mocked axios
import axios from 'axios';
import { getToken, setToken, removeToken, isTokenValid } from '@/store/slices/authSlice';
import logger from '@/utils/logger';

// Create instance - if axios is mocked, this will use the mock
const axiosInstance = (typeof axios.create === 'function' && axios.create.toString().includes('jest.fn')) 
  ? axios.create() 
  : axios.create({
      baseURL: process.env.VITE_API_URL || global.__VITE_IMPORT_META_ENV__?.VITE_API_URL || 'http://localhost:5000/api',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

// Mock interceptors that match the actual implementation
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && isTokenValid()) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    const token = response.data?.token;
    if (token) {
      setToken(token);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      const token = getToken();
      if (!error.config?.url?.includes('/auth/me') || token) {
        removeToken();
      }
      if (!error.config?.url?.includes('/auth/me')) {
        logger.warn('Authentication failed');
      }
    } else if (error.response?.status !== 401) {
      const errorData = error.response?.data;
      const errorMessage = errorData?.error || errorData?.message || error.message;
      logger.error(`API Error [${error.response?.status}]:`, errorMessage);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

