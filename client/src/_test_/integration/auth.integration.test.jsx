import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/slices/authSlice';
import * as authAPI from '@/api/authApi';

jest.mock('@/api/authApi');

const createTestStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  });
};

const createWrapper = (store) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }) => (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>{children}</BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
};

describe('Auth Integration', () => {
  let store;

  beforeEach(() => {
    store = createTestStore();
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('Login Flow', () => {
    it('should handle successful login', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'freelancer',
      };

      authAPI.login.mockResolvedValue({
        data: {
          data: {
            user: mockUser,
            token: 'test-token',
          },
        },
      });

      await store.dispatch(
        require('@/store/slices/authSlice').loginUser({
          email: 'test@example.com',
          password: 'password123',
        })
      );

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
      expect(localStorage.getItem('linkify_token')).toBe('test-token');
    });

    it('should handle login failure', async () => {
      authAPI.login.mockRejectedValue({
        response: {
          data: {
            error: 'Invalid credentials',
          },
        },
      });

      await store.dispatch(
        require('@/store/slices/authSlice').loginUser({
          email: 'test@example.com',
          password: 'wrong',
        })
      );

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBe('Invalid credentials');
    });
  });

  describe('Registration Flow', () => {
    it('should handle successful registration', async () => {
      const mockUser = {
        id: 1,
        email: 'new@example.com',
        name: 'New User',
        role: 'client',
      };

      authAPI.register.mockResolvedValue({
        data: {
          data: {
            user: mockUser,
            token: 'new-token',
          },
        },
      });

      await store.dispatch(
        require('@/store/slices/authSlice').registerUser({
          email: 'new@example.com',
          password: 'password123',
          name: 'New User',
          role: 'client',
        })
      );

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
    });
  });

  describe('Logout Flow', () => {
    it('should handle logout', async () => {
      // First login
      authAPI.login.mockResolvedValue({
        data: {
          data: {
            user: { id: 1 },
            token: 'test-token',
          },
        },
      });

      await store.dispatch(
        require('@/store/slices/authSlice').loginUser({
          email: 'test@example.com',
          password: 'password123',
        })
      );

      // Then logout
      authAPI.logout.mockResolvedValue({});
      await store.dispatch(require('@/store/slices/authSlice').logoutUser());

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(localStorage.getItem('linkify_token')).toBeNull();
    });
  });
});


