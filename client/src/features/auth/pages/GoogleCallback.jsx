import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { fetchCurrentUser, setToken } from "../../../store/slices/authSlice";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";

export default function GoogleCallback() {
  const [status, setStatus] = useState('processing');
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent duplicate execution
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const handleCallback = async () => {
      try {
        const token = searchParams.get('token');
        const success = searchParams.get('success');
        const profileIncomplete = searchParams.get('profileIncomplete');
        const error = searchParams.get('error');

        // Handle error case
        if (error) {
          setStatus('error');
          
          // Decode the error message
          const decodedError = decodeURIComponent(error);
          
          // Check if it's a ban/suspension error
          let errorMsg;
          const errorLower = decodedError.toLowerCase();
          if (errorLower.includes('banned') || errorLower.includes('suspended')) {
            errorMsg = decodedError;
          } else if (error === 'authentication_failed') {
            errorMsg = 'Google authentication failed. Please try again.';
          } else {
            errorMsg = decodedError; // Show the actual error message from server
          }
          
          setErrorMessage(errorMsg);
          
          // Show more prominent toast for ban/suspension
          if (errorLower.includes('banned') || errorLower.includes('suspended')) {
            toast.error(errorMsg, {
              duration: 6000,
              style: {
                background: '#ef4444',
                color: '#fff',
                fontWeight: '600',
                padding: '16px',
              },
            });
          } else {
            toast.error(errorMsg);
          }
          
          setTimeout(() => navigate('/login'), 5000);
          return;
        }

        // Handle success case
        if (token) {
          console.log('[GoogleCallback] Processing new Google authentication...');
          
          // Clear ALL stale state before processing new token
          dispatch({ type: 'auth/clearAuth' });
          localStorage.clear();
          sessionStorage.clear();
          
          // Store NEW token
          setToken(token);
          
          // Fetch user data for NEW account - ONLY ONCE
          const userData = await dispatch(fetchCurrentUser()).unwrap();
          
          console.log('[GoogleCallback] Fresh user data fetched:', { 
            role: userData?.role, 
            adminRole: userData?.adminRole,
            email: userData?.email 
          });
          
          setStatus('success');
          
          // Navigate based on profile completion status
          if (profileIncomplete === 'true') {
            toast.success('Please complete your profile to continue');
            setTimeout(() => navigate('/complete-profile', { replace: true }), 1500);
          } else if (success === 'true') {
            toast.success('Welcome back!');
            // Admin must have BOTH role and adminRole
            const isAdmin = userData?.role === 'admin' && userData?.adminRole;
            const defaultRedirect = isAdmin ? '/admin/dashboard' : '/dashboard';
            const redirectTo = localStorage.getItem('redirectAfterAuth') || defaultRedirect;
            localStorage.removeItem('redirectAfterAuth');
            console.log('[GoogleCallback] Redirecting to:', redirectTo, 'isAdmin:', isAdmin);
            setTimeout(() => navigate(redirectTo, { replace: true }), 1500);
          } else {
            setStatus('error');
            setErrorMessage('Invalid authentication response.');
            toast.error('Invalid authentication response');
            setTimeout(() => navigate('/login'), 3000);
          }
        } else {
          setStatus('error');
          setErrorMessage('No authentication token received.');
          toast.error('Authentication failed');
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (err) {
        setStatus('error');
        
        // Check if error is related to ban/suspension
        const errorMsg = err?.message || err || 'Authentication processing failed. Please try again.';
        const errorMsgLower = typeof errorMsg === 'string' ? errorMsg.toLowerCase() : '';
        
        if (errorMsgLower.includes('banned') || errorMsgLower.includes('suspended')) {
          setErrorMessage(errorMsg);
          toast.error(errorMsg, {
            duration: 6000,
            style: {
              background: '#ef4444',
              color: '#fff',
              fontWeight: '600',
              padding: '16px',
            },
          });
        } else {
          setErrorMessage(errorMsg);
          toast.error(errorMsg);
        }
        
        setTimeout(() => navigate('/login'), 5000);
      }
    };

    handleCallback();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="w-full max-w-md"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                {status === 'processing' && (
                  <>
                    <div className="mx-auto flex justify-center">
                      <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Processing Google Login
                    </h2>
                    <p className="text-gray-600">Please wait while we authenticate you...</p>
                  </>
                )}

                {status === 'success' && (
                  <>
                    <motion.div
                      variants={iconVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-gray-900">Login Successful!</h2>
                    <p className="text-gray-600">Redirecting you now...</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-green-600"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5, ease: "linear" }}
                      />
                    </div>
                  </>
                )}

                {status === 'error' && (
                  <>
                    <motion.div
                      variants={iconVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <XCircle className="h-16 w-16 text-red-600 mx-auto" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-gray-900">Login Failed</h2>
                    <p className="text-gray-600 font-medium">{errorMessage}</p>
                    {(errorMessage?.includes('banned') || errorMessage?.includes('suspended')) && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800 font-semibold">
                          Please contact our support center for assistance.
                        </p>
                        <p className="text-xs text-red-600 mt-1">
                          Visit our Help Center or email support for more information.
                        </p>
                      </div>
                    )}
                    <p className="text-sm text-gray-500">Redirecting to login page in 5 seconds...</p>
                    <Button
                      onClick={() => navigate('/login')}
                      variant="default"
                      className="mt-4"
                    >
                      Go to Login Now
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}