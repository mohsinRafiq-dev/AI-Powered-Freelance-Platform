import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Loader2 } from "lucide-react";
import { fetchCurrentUser, isTokenValid, getToken } from "../../store/slices/authSlice";
import logger from "@/utils/logger";

export default function PrivateRoute({ children, requireCompleteProfile = true }) {
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
          logger.debug('PrivateRoute: Fetching user data...');
          await dispatch(fetchCurrentUser()).unwrap();
        } catch (error) {
          logger.error('PrivateRoute: Failed to fetch user:', error);
        }
      }
      setIsInitializing(false);
    };

    initializeAuth();
  }, [user, isAuthenticated, dispatch]);

  // Check if profile is truly complete
  // Admin users with adminRole don't need profile completion
  const isAdmin = user?.role === 'admin' && user?.adminRole;
  const isProfileComplete = Boolean(
    isAdmin ||
    (user?.isProfileComplete === true && 
     user?.role && 
     ['freelancer', 'client'].includes(user.role))
  );

  logger.debug('PrivateRoute check:', {
    path: location.pathname,
    isAuthenticated,
    isLoading,
    isInitializing,
    requireCompleteProfile,
    isProfileComplete,
    userRole: user?.role,
    userIsProfileComplete: user?.isProfileComplete,
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
    logger.debug('Not authenticated, redirecting to login');
    localStorage.setItem('redirectAfterAuth', location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check profile completion (only if required by route)
  if (requireCompleteProfile && !isProfileComplete) {
    logger.debug('Profile incomplete, redirecting to complete-profile');
    return <Navigate to="/complete-profile" replace />;
  }

  // If we're on complete-profile but profile IS complete, redirect to dashboard
  if (location.pathname === '/complete-profile' && isProfileComplete) {
    const redirectPath = isAdmin ? '/admin/dashboard' : '/dashboard';
    logger.debug('Profile complete but on complete-profile page, redirecting to', redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  // Redirect admin users from /dashboard to /admin/dashboard
  if (location.pathname === '/dashboard' && isAdmin) {
    logger.debug('Admin user accessing regular dashboard, redirecting to admin dashboard');
    return <Navigate to="/admin/dashboard" replace />;
  }

  logger.debug('PrivateRoute: Access granted');
  return children;
}
