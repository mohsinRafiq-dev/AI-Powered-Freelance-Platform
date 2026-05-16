import { removeToken, getToken, setToken, isTokenValid } from '@/store/slices/authSlice';

// Mock axiosInstance first - this will be used by both alias and relative imports
jest.mock('@/api/axiosInstance', () => {
  const mockInstance = {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
    interceptors: {
      request: { use: jest.fn(), handlers: [] },
      response: { use: jest.fn(), handlers: [] },
    },
  };
  return {
    __esModule: true,
    default: mockInstance,
  };
});

// Mock axios to return a mock instance when create() is called
// This ensures that when axiosInstance.js runs (via relative import), it also gets a mock
jest.mock('axios', () => {
  const mockInstance = {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
    interceptors: {
      request: { use: jest.fn(), handlers: [] },
      response: { use: jest.fn(), handlers: [] },
    },
  };
  return {
    __esModule: true,
    default: {
      create: jest.fn(() => mockInstance),
    },
  };
});

// Import after mocking - axiosInstance will be our mock
import axiosInstance from '@/api/axiosInstance';
import * as authApi from '@/api/authApi';

jest.mock('@/store/slices/authSlice', () => ({
  getToken: jest.fn(() => null),
  setToken: jest.fn(),
  removeToken: jest.fn(),
  isTokenValid: jest.fn(() => false),
}));

describe('authApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should call register endpoint', async () => {
      const userData = { email: 'test@example.com', password: 'password' };
      const mockResponse = { data: { success: true } };
      axiosInstance.post.mockResolvedValue(mockResponse);

      const result = await authApi.register(userData);
      expect(axiosInstance.post).toHaveBeenCalledWith('/auth/register', userData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('login', () => {
    it('should call login endpoint', async () => {
      const credentials = { email: 'test@example.com', password: 'password' };
      const mockResponse = { data: { success: true } };
      axiosInstance.post.mockResolvedValue(mockResponse);

      const result = await authApi.login(credentials);
      expect(axiosInstance.post).toHaveBeenCalledWith('/auth/login', credentials);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('logout', () => {
    it('should call logout endpoint and remove token', async () => {
      axiosInstance.post.mockResolvedValue({ data: { success: true } });

      await authApi.logout();
      expect(axiosInstance.post).toHaveBeenCalledWith('/auth/logout');
      expect(removeToken).toHaveBeenCalled();
    });

    it('should remove token even if logout fails', async () => {
      const networkError = new Error('Network Error');
      axiosInstance.post.mockRejectedValue(networkError);

      await expect(authApi.logout()).rejects.toThrow('Network Error');
      expect(removeToken).toHaveBeenCalled();
    });
  });

  describe('getCurrentUser', () => {
    it('should call getCurrentUser endpoint', async () => {
      const mockResponse = { data: { user: { id: 1 } } };
      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await authApi.me();
      expect(axiosInstance.get).toHaveBeenCalledWith('/auth/me');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('completeProfile', () => {
    it('should call completeProfile endpoint', async () => {
      const profileData = { bio: 'Test bio' };
      const mockResponse = { data: { success: true } };
      axiosInstance.post.mockResolvedValue(mockResponse);

      const result = await authApi.completeProfile(profileData);
      expect(axiosInstance.post).toHaveBeenCalledWith('/auth/complete-profile', profileData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('googleAuth', () => {
    it('should call googleAuth endpoint', async () => {
      const idToken = 'google-id-token';
      const mockResponse = { data: { success: true } };
      axiosInstance.post.mockResolvedValue(mockResponse);

      const result = await authApi.googleAuth(idToken);
      expect(axiosInstance.post).toHaveBeenCalledWith('/auth/google', { idToken });
      expect(result).toEqual(mockResponse);
    });
  });
});


