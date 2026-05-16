
import axios from "axios";
import { getToken, setToken, removeToken, isTokenValid } from "@/store/slices/authSlice";
import logger from "@/utils/logger";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && isTokenValid()) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle tokens and errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Extract token from response if present (for login/register)
    const token = response.data?.token;
    if (token) {
      setToken(token);
    }
    return response;
  },
  (error) => {
    // Handle 401 errors by clearing invalid tokens
    if (error.response?.status === 401) {
      const token = getToken();
      // Only clear token if it's not the initial /me check
      if (!error.config?.url?.includes('/auth/me') || token) {
        removeToken();
      }
      
      // Don't log 401 errors for /me endpoint as they're expected when not logged in
      if (!error.config?.url?.includes('/auth/me')) {
        logger.warn('Authentication failed');
      }
    } else if (error.response?.status !== 401) {
      // Better error logging
      const errorData = error.response?.data;
      const errorMessage = errorData?.error || errorData?.message || error.message;
      logger.error(`API Error [${error.response?.status}]:`, errorMessage);
      
      // Log full error data in development
      if (import.meta.env.DEV) {
        console.error('Full error response:', errorData);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
