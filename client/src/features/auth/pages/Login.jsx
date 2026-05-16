import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { LogIn, Mail, Lock, Chrome } from "lucide-react";
import { loginUser, getToken, isTokenValid } from "../../../store/slices/authSlice";
import { loginSchema } from "../../../utils/validation";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { ButtonLoader, SuccessLoader } from "../../../components/common/Loader";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const { isLoading, isAuthenticated, isProfileComplete, user } = useSelector((state) => state.auth);
  const errorShown = useRef(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onBlur",
  });

  // Cleanup on mount - ensure no stale auth data when explicitly on login page
  useEffect(() => {
    // When user lands on /login page, check if they should actually be here
    // This prevents redirect loops after logout
    const hasToken = getToken();
    const tokenValid = isTokenValid();
    
    console.log('[Login Mount] Token check:', { hasToken: !!hasToken, tokenValid, isAuthenticated });
    
    // If there's no valid token but Redux thinks we're authenticated, clear the state
    if (!tokenValid && isAuthenticated) {
      console.log('[Login Mount] Invalid token detected, clearing auth state');
      dispatch({ type: 'auth/clearAuth' });
      queryClient.removeQueries(['adminPermissions']);
      localStorage.removeItem('redirectAfterAuth');
    }
  }, []); // Only run once on mount

  // Check for error messages from URL parameters (e.g., from failed Google OAuth)
  useEffect(() => {
    if (errorShown.current) return;
    
    const errorParam = searchParams.get('error');
    if (errorParam) {
      errorShown.current = true;
      
      switch (errorParam) {
        case 'auth_failed':
        case 'authentication_failed':
          toast.error('Google authentication failed. Please try again.');
          break;
        case 'server_error':
          toast.error('Server error occurred. Please try again later.');
          break;
        case 'callback_failed':
          toast.error('Login completion failed. Please try again.');
          break;
        default:
          toast.error('An error occurred during login.');
      }
      // Clear the error from URL
      window.history.replaceState({}, '', '/login');
    }
  }, []);

  // Redirect if already authenticated WITH VALID TOKEN
  useEffect(() => {
    // Only redirect if authenticated AND token is valid
    const tokenValid = isTokenValid();
    
    if (isAuthenticated && user && tokenValid) {
      console.log('[Login] Redirect check:', { role: user.role, adminRole: user.adminRole, isProfileComplete, tokenValid });
      if (isProfileComplete) {
        // Admin users with adminRole go to admin dashboard
        const isAdmin = user.role === 'admin' && user.adminRole;
        const redirectPath = isAdmin ? '/admin/dashboard' : '/dashboard';
        console.log('[Login] Redirecting to:', redirectPath);
        navigate(redirectPath, { replace: true });
      } else {
        navigate('/complete-profile', { replace: true });
      }
    } else if (isAuthenticated && !tokenValid) {
      // Token expired or invalid, clear auth state
      console.log('[Login] Token invalid but state says authenticated, clearing state');
      dispatch({ type: 'auth/clearAuth' });
    }
  }, [isAuthenticated, isProfileComplete, user?.role, user?.adminRole, user, navigate, dispatch]);

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(loginUser(data)).unwrap();
      
      // Clear and refetch admin permissions for fresh data
      queryClient.removeQueries(['adminPermissions']);
      
      // Show success loader
      setShowSuccess(true);
      toast.success('Welcome back!');
      
      // Get user data from login result - THIS IS THE FRESH DATA
      const userData = result.user;
      const profileComplete = result.user?.isProfileComplete || false;
      
      console.log('[Login] Login successful:', { role: userData?.role, adminRole: userData?.adminRole, profileComplete });
      
      // Navigate after showing success
      setTimeout(() => {
        if (profileComplete) {
          // Admin users with adminRole go to admin dashboard
          const isAdmin = userData?.role === 'admin' && userData?.adminRole;
          const redirectPath = isAdmin ? '/admin/dashboard' : '/dashboard';
          console.log('[Login] Navigating to:', redirectPath, 'isAdmin:', isAdmin);
          navigate(redirectPath, { replace: true });
        } else {
          navigate('/complete-profile', { replace: true });
        }
      }, 1500);
    } catch (err) {
      // Check if the error is related to banned or suspended account
      const errorMessage = err || "Login failed. Please check your credentials.";
      
      if (errorMessage.includes('banned') || errorMessage.includes('suspended')) {
        // Show a more prominent error for banned/suspended users
        toast.error(errorMessage, {
          duration: 6000, // Show for longer
          style: {
            background: '#ef4444',
            color: '#fff',
            fontWeight: '600',
            padding: '16px',
          },
        });
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const handleGoogleLogin = () => {
    try {
      console.log('[Login] Initiating Google login with account picker...');
      
      // Runtime check for production
      const isProduction = window.location.hostname !== 'localhost';
      const apiUrl = isProduction 
        ? 'https://linkify-server-production.up.railway.app/api'
        : import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      // Add prompt=select_account to force Google to show account picker
      // This prevents auto-login with previous Google account
      window.location.href = `${apiUrl}/auth/google?prompt=select_account`;
    } catch (err) {
      toast.error("Failed to initiate Google login");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      {/* Success Loader Overlay */}
      {showSuccess && <SuccessLoader text="Login Successful!" />}
      
      <div className="min-h-screen pt-0 md:pt-24 lg:pt-28 pb-24 md:pb-4 bg-gradient-to-br from-brand-light/30 via-white to-brand/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand/5 dark:bg-brand/10 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-dark/5 dark:bg-brand-dark/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        <Card glass className="border-2 border-brand-light/30 dark:border-brand-deeper shadow-[0_8px_32px_0_rgba(31,38,135,0.2)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.25)] dark:hover:shadow-[0_12px_40px_0_rgba(0,0,0,0.5)] transition-all duration-400">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-6">
              <motion.div 
                className="bg-gradient-brand p-4 rounded-2xl shadow-brand"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <LogIn className="h-8 w-8 text-white" />
              </motion.div>
            </div>
            <CardTitle className="text-3xl font-bold text-brand-deepest dark:text-white">Welcome Back</CardTitle>
            <CardDescription className="text-center text-brand-deeper dark:text-gray-300 text-base">
              Sign in to your <span className="font-semibold text-brand dark:text-brand-light">Linkify</span> account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Label htmlFor="email" className="flex items-center gap-2 text-brand-deepest dark:text-white font-medium">
                  <Mail className="h-4 w-4 text-brand dark:text-brand-light" />
                  Email Address
                </Label>
                <Input
                  glass
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  disabled={isLoading}
                  className="touch-target border-brand-light/50 focus:border-brand focus:ring-brand"
                />
                {errors.email && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span>⚠</span> {errors.email.message}
                  </p>
                )}
              </motion.div>

              {/* Password Field */}
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Label htmlFor="password" className="flex items-center gap-2 text-brand-deepest dark:text-white font-medium">
                  <Lock className="h-4 w-4 text-brand dark:text-brand-light" />
                  Password
                </Label>
                <Input
                  glass
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  disabled={isLoading}
                  className="touch-target border-brand-light/50 focus:border-brand focus:ring-brand"
                />
                {errors.password && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span>⚠</span> {errors.password.message}
                  </p>
                )}
              </motion.div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-brand hover:text-brand-dark dark:text-brand-light dark:hover:text-brand hover:underline font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                glass
                type="submit"
                className="w-full touch-target text-white shadow-brand hover:shadow-brand-lg transition-all duration-300 hover:scale-[1.02] font-semibold"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <ButtonLoader text="Signing In" />
                ) : (
                  <>
                    <LogIn className="mr-2 h-5 w-5" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-brand-light/50 dark:border-brand-deeper" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-brand-deepest px-4 text-brand-deeper dark:text-gray-300 font-medium">Or continue with</span>
              </div>
            </div>

            {/* Google Sign In */}
            <Button
              glass
              type="button"
              variant="outline"
              className="w-full touch-target transition-all duration-300"
              size="lg"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <Chrome className="mr-2 h-5 w-5" />
              Sign in with Google
            </Button>

            {/* Register Link */}
            <motion.div 
              className="mt-8 text-center text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-brand-deeper dark:text-gray-300">Don't have an account? </span>
              <Link
                to="/register"
                className="text-brand hover:text-brand-dark dark:text-brand-light dark:hover:text-brand font-bold hover:underline transition-colors inline-flex items-center gap-1"
              >
                Sign Up
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </motion.div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center text-sm text-brand-deeper dark:text-gray-400"
        >
          <p className="mb-2">By signing in, you agree to our</p>
          <div className="flex justify-center gap-3">
            <Link to="/terms" className="text-brand hover:text-brand-dark dark:text-brand-light dark:hover:text-brand hover:underline font-medium transition-colors">
              Terms of Service
            </Link>
            <span className="text-brand-light dark:text-gray-500">•</span>
            <Link to="/privacy" className="text-brand hover:text-brand-dark dark:text-brand-light dark:hover:text-brand hover:underline font-medium transition-colors">
              Privacy Policy
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
    </>
  );
}
