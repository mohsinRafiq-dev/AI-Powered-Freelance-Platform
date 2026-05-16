import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Loader2, ShieldAlert } from "lucide-react";
import { fetchCurrentUser, isTokenValid, getToken } from "../../store/slices/authSlice";
import logger from "@/utils/logger";

export default function AdminRoute({ children }) {
  const { isAuthenticated, isLoading, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const [isInitializing, setIsInitializing] = useState(true);

  // Fetch user data if we have a valid token but no user data
  useEffect(() => {
    const initializeAuth = async () => {
      const hasToken = getToken();
      const tokenIsValid = isTokenValid();
      
      // If we have a valid token but no user data and not already authenticated
      if (hasToken && tokenIsValid && !user && !isAuthenticated) {
        try {
          logger.debug('AdminRoute: Fetching user data...');
          await dispatch(fetchCurrentUser()).unwrap();
        } catch (error) {
          logger.error('AdminRoute: Failed to fetch user:', error);
        }
      }
      setIsInitializing(false);
    };

    initializeAuth();
  }, [user, isAuthenticated, dispatch]);

  logger.debug('AdminRoute check:', {
    path: location.pathname,
    isAuthenticated,
    isLoading,
    isInitializing,
    userRole: user?.role,
    adminRole: user?.adminRole,
    userId: user?.id
  });

  // Show loading state
  if (isLoading || isInitializing) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 dark:text-brand-light animate-spin mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Check authentication
  if (!isAuthenticated || !isTokenValid()) {
    logger.warn('AdminRoute: Not authenticated, redirecting to login');
    localStorage.setItem('redirectAfterAuth', location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Allow any user with role 'admin' to access the admin area.
  // Specific pages that require elevated adminRole (e.g. super-admin) should enforce that separately.
  const isAdmin = user?.role === 'admin';
  
  if (!isAdmin) {
    logger.warn('AdminRoute: Access denied - User is not an admin', {
      userId: user?.id,
      userRole: user?.role,
      adminRole: user?.adminRole,
      attemptedPath: location.pathname
    });
    
    // Clear any stale redirect paths
    localStorage.removeItem('redirectAfterAuth');
    
    // Show unauthorized access page
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center max-w-md mx-auto p-8">
          <ShieldAlert className="h-24 w-24 text-red-600 dark:text-red-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You don't have permission to access the admin portal. This area is restricted to administrators only.
          </p>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  logger.debug('AdminRoute: Access granted - User is admin');
  return children;
}
