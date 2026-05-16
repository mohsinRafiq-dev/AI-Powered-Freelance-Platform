import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import proposalReducer from './slices/proposalSlice';

/**
 * Redux Store Configuration
 * 
 * STATE MANAGEMENT STRATEGY:
 * - Redux: Global app state (auth, proposals - legacy)
 * - React Query: Server data (jobs, profile, users)
 * 
 * NOTE: Proposals use Redux for historical reasons. 
 * Future refactoring should migrate to React Query for consistency.
 * 
 * AUTH PERSISTENCE:
 * - Auth state is persisted via token in localStorage
 * - User data is fetched on app load if valid token exists
 * - See AuthInitializer component for restoration logic
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    proposals: proposalReducer, // TODO: Migrate to React Query
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/login/fulfilled', 'auth/register/fulfilled'],
      },
    }),
});

export default store;
