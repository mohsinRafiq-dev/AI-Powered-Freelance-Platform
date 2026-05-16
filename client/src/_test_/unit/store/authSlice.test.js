import { configureStore } from '@reduxjs/toolkit';
import authReducer, {
  loginUser,
  registerUser,
  fetchCurrentUser,
  completeUserProfile,
  logoutUser,
  clearError,
  setUser,
  clearAuth,
  getToken,
  setToken,
  removeToken,
  isTokenValid,
} from '@/store/slices/authSlice';
import * as authAPI from '@/api/authApi';

jest.mock('@/api/authApi');

describe('authSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('token utilities', () => {
    it('should set token in localStorage', () => {
      setToken('test-token');
      expect(localStorage.getItem('linkify_token')).toBe('test-token');
    });

    it('should get token from localStorage', () => {
      localStorage.setItem('linkify_token', 'test-token');
      expect(getToken()).toBe('test-token');
    });

    it('should remove token from localStorage', () => {
      localStorage.setItem('linkify_token', 'test-token');
      removeToken();
      expect(localStorage.getItem('linkify_token')).toBeNull();
    });

    it('should validate token expiration', () => {
      // Create a valid token (expires in future)
      const payload = {
        exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
      };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      setToken(token);
      expect(isTokenValid()).toBe(true);
    });

    it('should return false for expired token', () => {
      // Create an expired token
      const payload = {
        exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
      };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      setToken(token);
      expect(isTokenValid()).toBe(false);
    });

    it('should return false for invalid token', () => {
      setToken('invalid-token');
      expect(isTokenValid()).toBe(false);
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = store.getState().auth;
      expect(state).toEqual({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isLoggingOut: false,
        error: null,
        isProfileComplete: false,
      });
    });
  });

  describe('loginUser', () => {
    it('should handle successful login', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      const mockResponse = {
        data: {
          data: {
            user: mockUser,
            token: 'test-token',
          },
        },
      };
      authAPI.login.mockResolvedValue(mockResponse);

      await store.dispatch(loginUser({ email: 'test@example.com', password: 'password' }));

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle login failure', async () => {
      const errorMessage = 'Invalid credentials';
      authAPI.login.mockRejectedValue({
        response: { data: { error: errorMessage } },
      });

      await store.dispatch(loginUser({ email: 'test@example.com', password: 'wrong' }));

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('registerUser', () => {
    it('should handle successful registration', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      const mockResponse = {
        data: {
          data: {
            user: mockUser,
            token: 'test-token',
          },
        },
      };
      authAPI.register.mockResolvedValue(mockResponse);

      await store.dispatch(registerUser({ email: 'test@example.com', password: 'password' }));

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
    });

    it('should handle registration failure', async () => {
      const errorMessage = 'Email already exists';
      authAPI.register.mockRejectedValue({
        response: { data: { error: errorMessage } },
      });

      await store.dispatch(registerUser({ email: 'test@example.com', password: 'password' }));

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('fetchCurrentUser', () => {
    it('should fetch current user successfully', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      // The API returns response.data.data which should be { user: ... }
      // fetchCurrentUser returns response.data.data, so it should be { user: ... }
      const mockResponse = {
        data: {
          data: {
            user: mockUser, // The API returns data.data.user
          },
        },
      };
      authAPI.me.mockResolvedValue(mockResponse);
      // Set a valid JWT token in localStorage
      // JWT format: header.payload.signature
      // We need a token with a valid exp claim
      const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6IlRlc3QiLCJleHAiOjk5OTk5OTk5OTl9.signature';
      setToken(validToken);

      await store.dispatch(fetchCurrentUser());

      const state = store.getState().auth;
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should handle fetch failure when no valid token', async () => {
      removeToken();
      await store.dispatch(fetchCurrentUser());

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('completeUserProfile', () => {
    it('should complete profile successfully', async () => {
      const mockUser = { id: 1, isProfileComplete: true };
      const mockResponse = {
        data: {
          data: {
            user: mockUser,
          },
        },
      };
      authAPI.completeProfile.mockResolvedValue(mockResponse);

      await store.dispatch(completeUserProfile({ bio: 'Test bio' }));

      const state = store.getState().auth;
      expect(state.isProfileComplete).toBe(true);
      expect(state.user).toEqual(mockUser);
    });
  });

  describe('logoutUser', () => {
    it('should logout successfully', async () => {
      authAPI.logout.mockResolvedValue({});
      setToken('test-token');

      await store.dispatch(logoutUser());

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(getToken()).toBeNull();
    });
  });

  describe('reducers', () => {
    it('should clear error', () => {
      store.dispatch(clearError());
      expect(store.getState().auth.error).toBeNull();
    });

    it('should set user', () => {
      const user = { id: 1, email: 'test@example.com' };
      store.dispatch(setUser(user));
      const state = store.getState().auth;
      expect(state.user).toEqual(user);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should clear auth', () => {
      store.dispatch(clearAuth());
      const state = store.getState().auth;
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });
});

