// Use the mocked axiosInstance which now has interceptors
import axiosInstance from '@/api/axiosInstance';
import { getToken, setToken, removeToken, isTokenValid } from '@/store/slices/authSlice';
import logger from '@/utils/logger';

jest.mock('@/store/slices/authSlice');
jest.mock('@/utils/logger');

describe('axiosInstance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('request interceptor', () => {
    it('should add token to headers if token is valid', () => {
      getToken.mockReturnValue('valid-token');
      isTokenValid.mockReturnValue(true);

      const config = {
        headers: {},
      };

      // Get the last interceptor (the one we added)
      const handlers = axiosInstance.interceptors.request.handlers;
      const interceptor = handlers[handlers.length - 1].fulfilled;
      const result = interceptor(config);

      expect(result.headers.Authorization).toBe('Bearer valid-token');
    });

    it('should not add token if token is invalid', () => {
      getToken.mockReturnValue('invalid-token');
      isTokenValid.mockReturnValue(false);

      const config = {
        headers: {},
      };

      // Get the last interceptor
      const handlers = axiosInstance.interceptors.request.handlers;
      const interceptor = handlers[handlers.length - 1].fulfilled;
      const result = interceptor(config);

      expect(result.headers.Authorization).toBeUndefined();
    });

    it('should handle request errors', () => {
      const error = new Error('Request error');
      // Get the last interceptor
      const handlers = axiosInstance.interceptors.request.handlers;
      const interceptor = handlers[handlers.length - 1].rejected;

      return expect(interceptor(error)).rejects.toThrow('Request error');
    });
  });

  describe('response interceptor', () => {
    it('should set token from response data', () => {
      const response = {
        data: {
          token: 'new-token',
        },
      };

      // Get the last interceptor
      const handlers = axiosInstance.interceptors.response.handlers;
      const interceptor = handlers[handlers.length - 1].fulfilled;
      interceptor(response);

      expect(setToken).toHaveBeenCalledWith('new-token');
    });

    it('should return response as is', () => {
      const response = {
        data: { user: {} },
      };

      // Get the last interceptor
      const handlers = axiosInstance.interceptors.response.handlers;
      const interceptor = handlers[handlers.length - 1].fulfilled;
      const result = interceptor(response);

      expect(result).toBe(response);
    });

    it('should handle 401 errors by removing token', () => {
      const error = {
        response: {
          status: 401,
          data: { error: 'Unauthorized' },
        },
        config: {
          url: '/api/test',
        },
      };

      getToken.mockReturnValue('token');
      // Get the last interceptor
      const handlers = axiosInstance.interceptors.response.handlers;
      const interceptor = handlers[handlers.length - 1].rejected;

      return interceptor(error).catch(() => {
        expect(removeToken).toHaveBeenCalled();
        expect(logger.warn).toHaveBeenCalled();
      });
    });

    it('should not log 401 errors for /auth/me endpoint', () => {
      const error = {
        response: {
          status: 401,
        },
        config: {
          url: '/auth/me',
        },
      };

      getToken.mockReturnValue(null);
      // Get the last interceptor
      const handlers = axiosInstance.interceptors.response.handlers;
      const interceptor = handlers[handlers.length - 1].rejected;

      return interceptor(error).catch(() => {
        expect(logger.warn).not.toHaveBeenCalled();
      });
    });

    it('should log other errors', () => {
      const error = {
        response: {
          status: 500,
          data: { error: 'Server error' },
        },
        message: 'Network error',
      };

      // Get the last interceptor
      const handlers = axiosInstance.interceptors.response.handlers;
      const interceptor = handlers[handlers.length - 1].rejected;

      return interceptor(error).catch(() => {
        expect(logger.error).toHaveBeenCalled();
      });
    });
  });
});


