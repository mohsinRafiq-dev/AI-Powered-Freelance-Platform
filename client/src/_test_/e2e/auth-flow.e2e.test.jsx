import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
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

const createWrapper = (store, initialEntries = ['/']) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }) => (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>
          {children}
        </MemoryRouter>
      </QueryClientProvider>
    </Provider>
  );
};

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Mock login page component
const LoginPage = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { loginUser } = require('@/store/slices/authSlice');
    await dispatch(loginUser({ email, password }));
  };

  return (
    <form onSubmit={handleSubmit} data-testid="login-form">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        data-testid="email-input"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        data-testid="password-input"
      />
      <button type="submit" disabled={isLoading} data-testid="login-button">
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {error && <div data-testid="error-message">{error}</div>}
    </form>
  );
};

describe('Auth E2E Flow', () => {
  let store;

  beforeEach(() => {
    store = createTestStore();
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should complete full login flow', async () => {
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

    render(<LoginPage />, {
      wrapper: createWrapper(store, ['/login']),
    });

    // Fill in form
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const loginButton = screen.getByTestId('login-button');

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(loginButton);

    // Wait for login to complete
    await waitFor(() => {
      expect(authAPI.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    // Check state
    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(mockUser);
    expect(localStorage.getItem('linkify_token')).toBe('test-token');
  });

  it('should handle login error and display message', async () => {
    authAPI.login.mockRejectedValue({
      response: {
        data: {
          error: 'Invalid credentials',
        },
      },
    });

    render(<LoginPage />, {
      wrapper: createWrapper(store, ['/login']),
    });

    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const loginButton = screen.getByTestId('login-button');

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'wrongpassword');
    await userEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent(
        'Invalid credentials'
      );
    });

    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(false);
  });
});

