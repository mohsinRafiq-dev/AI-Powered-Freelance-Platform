import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authAPI from "../../api/authApi";

// Token storage utilities
const TOKEN_KEY = 'linkify_token';

const setToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch (error) {
    // Silent fail - localStorage might be disabled
  }
};

const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    return null;
  }
};

const removeToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    // Silent fail
  }
};

const isTokenValid = () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    const payload = token.split('.')[1];
    if (!payload) return false;
    
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    if (!decoded || !decoded.exp) return false;
    
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

// Export for use in other files
export { getToken, setToken, removeToken, isTokenValid };

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      if (response.data.data?.token) {
        setToken(response.data.data.token);
      }
      return response.data.data;
    } catch (error) {
      const errorMessage = 
        error.response?.data?.error || 
        error.response?.data?.message || 
        'Login failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      if (response.data.data?.token) {
        setToken(response.data.data.token);
      }
      return response.data.data;
    } catch (error) {
      const errorMessage = 
        error.response?.data?.error || 
        error.response?.data?.message || 
        'Registration failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      if (!isTokenValid()) {
        return rejectWithValue('No valid token');
      }
      const response = await authAPI.me();
      return response.data.data;
    } catch (error) {
      removeToken();
      const errorMessage = 
        error.response?.data?.error || 
        error.response?.data?.message || 
        'Failed to fetch user';
      return rejectWithValue(errorMessage);
    }
  }
);

export const completeUserProfile = createAsyncThunk(
  'auth/completeProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await authAPI.completeProfile(profileData);
      
      // Store new token if provided
      if (response.data.data?.token) {
        setToken(response.data.data.token);
      }
      
      return response.data.data;
    } catch (error) {
      // Extract error message properly
      const errorMessage = 
        error.response?.data?.error || 
        error.response?.data?.message || 
        error.message || 
        'Failed to complete profile';
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout();
      removeToken();
      // Clear any redirect paths that might be cached
      localStorage.removeItem('redirectAfterAuth');
      return null;
    } catch (error) {
      removeToken();
      // Clear any redirect paths even on error
      localStorage.removeItem('redirectAfterAuth');
      return null;
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isLoggingOut: false,
  error: null,
  isProfileComplete: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isProfileComplete = action.payload?.isProfileComplete || false;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isProfileComplete = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        
        // Set profile completion flags
        const isComplete = Boolean(
          action.payload.user?.isProfileComplete &&
          action.payload.user?.role
        );
        state.isProfileComplete = isComplete;
        if (state.user) {
          state.user.isProfileComplete = isComplete;
        }
        
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        
        // Set profile completion based on response
        const isComplete = Boolean(
          action.payload.isProfileComplete || 
          action.payload.user?.isProfileComplete
        );
        state.isProfileComplete = isComplete;
        if (state.user) {
          state.user.isProfileComplete = isComplete;
        }
        
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
      })
      // Fetch current user
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isProfileComplete = action.payload.user?.isProfileComplete || false;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.isProfileComplete = false;
      })
      // Complete profile
      .addCase(completeUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        
        // CRITICAL: Force profile completion flags to true
        state.isProfileComplete = true;
        if (state.user) {
          state.user.isProfileComplete = true;
        }
        
        state.error = null;
      })
      .addCase(completeUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoggingOut = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isProfileComplete = false;
        state.isLoading = false;
        state.isLoggingOut = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isProfileComplete = false;
        state.isLoading = false;
        state.isLoggingOut = false;
        state.error = null;
      });
  },
});

export const { clearError, setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
