import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { resetPassword } from "../../../api/endpoints/auth";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { ButtonLoader } from "../../../components/common/Loader";

// Validation schema
const resetPasswordSchema = yup.object({
  newPassword: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Passwords must match")
    .required("Please confirm your password"),
});

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const email = location.state?.email;
  const otp = location.state?.otp;

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    mode: "onChange",
  });

  const newPassword = watch("newPassword");

  // Redirect if no email or OTP provided
  useEffect(() => {
    if (!email || !otp) {
      toast.error("Invalid access. Please start from the forgot password page");
      navigate("/forgot-password");
    }
  }, [email, otp, navigate]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await resetPassword(email, otp, data.newPassword, data.confirmPassword);
      toast.success("Password reset successfully!");
      // Navigate to login page
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to reset password. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = (password) => {
    if (!password) return { strength: 0, text: "", color: "" };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    if (strength <= 2) return { strength, text: "Weak", color: "text-red-600" };
    if (strength <= 3) return { strength, text: "Fair", color: "text-yellow-600" };
    if (strength <= 4) return { strength, text: "Good", color: "text-blue-600" };
    return { strength, text: "Strong", color: "text-green-600" };
  };

  const strength = passwordStrength(newPassword);

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
                <Lock className="h-8 w-8 text-white" />
              </motion.div>
            </div>
            <CardTitle className="text-3xl font-bold text-brand-deepest dark:text-white">Reset Password</CardTitle>
            <CardDescription className="text-center text-brand-deeper dark:text-gray-300 text-base">
              Create a new password for your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* New Password Field */}
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Label htmlFor="newPassword" className="flex items-center gap-2 text-brand-deepest dark:text-white font-medium">
                  <Lock className="h-4 w-4 text-brand dark:text-brand-light" />
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    glass
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    {...register("newPassword")}
                    disabled={isLoading}
                    className="pr-10 touch-target border-brand-light/50 focus:border-brand focus:ring-brand"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-deeper dark:text-gray-400 hover:text-brand dark:hover:text-brand-light transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span>⚠</span> {errors.newPassword.message}
                  </p>
                )}
                
                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="space-y-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            level <= strength.strength
                              ? strength.strength <= 2
                                ? "bg-red-500"
                                : strength.strength <= 3
                                ? "bg-yellow-500"
                                : strength.strength <= 4
                                ? "bg-blue-500"
                                : "bg-brand"
                              : "bg-gray-200 dark:bg-gray-700"
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs font-medium ${strength.color}`}>
                      Password strength: {strength.text}
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Confirm Password Field */}
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-brand-deepest dark:text-white font-medium">
                  <Lock className="h-4 w-4 text-brand dark:text-brand-light" />
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    glass
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    {...register("confirmPassword")}
                    disabled={isLoading}
                    className="pr-10 touch-target border-brand-light/50 focus:border-brand focus:ring-brand"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-deeper dark:text-gray-400 hover:text-brand dark:hover:text-brand-light transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span>⚠</span> {errors.confirmPassword.message}
                  </p>
                )}
              </motion.div>

              {/* Password Requirements */}
              <div className="bg-brand/5 dark:bg-brand/10 border border-brand/20 dark:border-brand/30 rounded-lg p-4">
                <p className="text-xs font-semibold text-brand-deepest dark:text-white mb-2">
                  Password must contain:
                </p>
                <ul className="space-y-1 text-xs text-brand-deeper dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-brand dark:text-brand-light" />
                    At least 6 characters
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-brand dark:text-brand-light" />
                    Mix of letters and numbers (recommended)
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full touch-target bg-gradient-brand hover:bg-gradient-to-r hover:from-brand-dark hover:to-brand-deepest text-white shadow-brand transition-all duration-300 font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <ButtonLoader text="Resetting Password..." />
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    Reset Password
                  </>
                )}
              </Button>
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
