import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser, isTokenValid } from '@/store/slices/authSlice';
import notificationService from '@/services/notificationService';
import logger from '@/utils/logger';

/**
 * AuthInitializer - Handles authentication state restoration on app load
 * This component checks for a valid token in localStorage and fetches user data
 * to restore the authenticated session after page refresh
 */
export default function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const initializeAuth = async () => {
      // Check if we have a valid token
      if (isTokenValid()) {
        try {
          logger.debug('Valid token found, fetching user data...');
          await dispatch(fetchCurrentUser()).unwrap();
          logger.debug('User data restored successfully');
        } catch (error) {
          logger.error('Failed to restore user session:', error);
          // Token is invalid or expired - fetchCurrentUser will handle cleanup
        }
      } else {
        logger.debug('No valid token found, user needs to login');
      }
    };

    initializeAuth();
  }, [dispatch]);

  // Initialize notification service when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      logger.debug('Initializing notification service...');
      notificationService.init();
      logger.debug('Notification service initialized');
    }
  }, [isAuthenticated]);

  return children;
}
