import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Shield, ArrowLeft, RefreshCw } from "lucide-react";
import { verifyOTP, requestPasswordReset } from "../../../api/endpoints/auth";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { ButtonLoader } from "../../../components/common/Loader";

// Validation schema
const verifyOTPSchema = yup.object({
  otp: yup
    .string()
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
    .required("OTP is required"),
});

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const [canResend, setCanResend] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [activeInput, setActiveInput] = useState(0);
  const inputRefs = useRef([]);
  const timerRef = useRef(null);

  const email = location.state?.email;

  const { handleSubmit, formState: { errors }, setValue, setError, clearErrors } = useForm({
    resolver: yupResolver(verifyOTPSchema),
    mode: "onChange",
  });

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      toast.error("Please start from the forgot password page");
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Update form value
    const otpString = newOtp.join("");
    setValue("otp", otpString);
    
    if (otpString.length === 6) {
      clearErrors("otp");
    }

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
      setActiveInput(index + 1);
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      
      if (otp[index]) {
        // Clear current input
        newOtp[index] = "";
        setOtp(newOtp);
        setValue("otp", newOtp.join(""));
      } else if (index > 0) {
        // Move to previous input and clear it
        newOtp[index - 1] = "";
        setOtp(newOtp);
        setValue("otp", newOtp.join(""));
        inputRefs.current[index - 1]?.focus();
        setActiveInput(index - 1);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setActiveInput(index - 1);
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
      setActiveInput(index + 1);
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split("").concat(Array(6 - pastedData.length).fill("")).slice(0, 6);
    setOtp(newOtp);
    setValue("otp", newOtp.join(""));
    
    if (newOtp.join("").length === 6) {
      clearErrors("otp");
      inputRefs.current[5]?.focus();
      setActiveInput(5);
    } else {
      inputRefs.current[pastedData.length]?.focus();
      setActiveInput(pastedData.length);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await verifyOTP(email, data.otp);
      toast.success("OTP verified successfully!");
      // Navigate to reset password page
      navigate("/reset-password", { state: { email, otp: data.otp } });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Invalid OTP. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      await requestPasswordReset(email);
      toast.success("New OTP sent to your email!");
      setTimeLeft(600); 
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      setValue("otp", "");
      inputRefs.current[0]?.focus();
      setActiveInput(0);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to resend OTP. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
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
                <Shield className="h-8 w-8 text-white" />
              </motion.div>
            </div>
            <CardTitle className="text-3xl font-bold text-brand-deepest dark:text-white">Verify OTP</CardTitle>
            <CardDescription className="text-center text-brand-deeper dark:text-gray-300 text-base">
              Enter the 6-digit code sent to <br />
              <span className="font-semibold text-brand dark:text-brand-light">{email}</span>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* OTP Input Fields */}
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Label className="flex items-center justify-center gap-2 text-brand-deepest dark:text-white font-medium text-base">
                  <Shield className="h-5 w-5 text-brand dark:text-brand-light" />
                  Enter Verification Code
                </Label>
                
                <div className="flex justify-center gap-2 sm:gap-3">
                  {otp.map((digit, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.05, type: "spring", stiffness: 300 }}
                    >
                      <input
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        onFocus={() => setActiveInput(index)}
                        disabled={isLoading}
                        className={`
                          w-12 h-14 sm:w-14 sm:h-16 
                          text-center text-2xl sm:text-3xl font-bold
                          bg-white dark:bg-brand-deepest/30
                          border-2 rounded-xl
                          transition-all duration-300
                          outline-none
                          ${activeInput === index 
                            ? 'border-brand shadow-lg shadow-brand/30 scale-105 ring-2 ring-brand/20' 
                            : digit 
                              ? 'border-brand/60 bg-brand/5 dark:bg-brand/10' 
                              : 'border-brand-light/40 dark:border-brand-deeper hover:border-brand/40'
                          }
                          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}
                          disabled:opacity-50
                          text-brand-deepest dark:text-white
                        `}
                        autoComplete="off"
                      />
                    </motion.div>
                  ))}
                </div>
                
                <AnimatePresence mode="wait">
                  {errors.otp && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-1 font-medium"
                    >
                      <span>⚠</span> {errors.otp.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Timer */}
              <div className="text-center">
                {timeLeft > 0 ? (
                  <p className="text-sm text-brand-deeper dark:text-gray-400">
                    Code expires in{" "}
                    <span className="font-semibold text-brand dark:text-brand-light">
                      {formatTime(timeLeft)}
                    </span>
                  </p>
                ) : (
                  <p className="text-sm text-red-600 dark:text-red-400 font-semibold">
                    OTP has expired
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full touch-target bg-gradient-brand hover:bg-gradient-to-r hover:from-brand-dark hover:to-brand-deepest text-white shadow-brand transition-all duration-300 font-semibold"
                disabled={isLoading || otp.join("").length !== 6}
              >
                {isLoading ? (
                  <ButtonLoader text="Verifying..." />
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    Verify Code
                  </>
                )}
              </Button>

              {/* Resend OTP */}
              <div className="text-center pt-2">
                {canResend ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleResendOTP}
                    disabled={isResending}
                    className="text-brand dark:text-brand-light hover:text-brand-dark dark:hover:text-brand hover:bg-brand/10 dark:hover:bg-brand/20"
                  >
                    {isResending ? (
                      <ButtonLoader text="Resending..." />
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Resend OTP
                      </>
                    )}
                  </Button>
                ) : (
                  <p className="text-sm text-brand-deeper dark:text-gray-400">
                    Didn't receive the code?{" "}
                    <span className="text-gray-500 dark:text-gray-500">
                      Wait {formatTime(timeLeft)}
                    </span>
                  </p>
                )}
              </div>

              {/* Back to Forgot Password Link */}
              <div className="text-center pt-2">
                <Link
                  to="/forgot-password"
                  className="inline-flex items-center gap-2 text-sm font-medium text-brand-deeper dark:text-gray-400 hover:text-brand dark:hover:text-brand-light transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Forgot Password
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Additional Help */}
        <div className="mt-6 text-center">
          <p className="text-sm text-brand-deeper dark:text-gray-400">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-semibold text-brand dark:text-brand-light hover:underline transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
