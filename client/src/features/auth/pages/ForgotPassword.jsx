import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Mail, ArrowLeft } from "lucide-react";
import { requestPasswordReset } from "../../../api/endpoints/auth";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { ButtonLoader } from "../../../components/common/Loader";

// Validation schema
const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
});

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, getValues } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await requestPasswordReset(data.email);
      toast.success(response.data?.message || "OTP sent to your email!");
      // Navigate to verify OTP page with email
      navigate("/verify-otp", { state: { email: data.email } });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to send OTP. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
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
                <Mail className="h-8 w-8 text-white" />
              </motion.div>
            </div>
            <CardTitle className="text-3xl font-bold text-brand-deepest dark:text-white">Forgot Password?</CardTitle>
            <CardDescription className="text-center text-brand-deeper dark:text-gray-300 text-base">
              Enter your email address and we'll send you an <span className="font-semibold text-brand dark:text-brand-light">OTP</span> to reset your password
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full touch-target bg-gradient-brand hover:bg-gradient-to-r hover:from-brand-dark hover:to-brand-deepest text-white shadow-brand transition-all duration-300 font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <ButtonLoader text="Sending OTP..." />
                ) : (
                  <>
                    <Mail className="w-5 h-5 mr-2" />
                    Send OTP
                  </>
                )}
              </Button>

              {/* Back to Login Link */}
              <div className="text-center pt-4">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm font-medium text-brand-deeper dark:text-gray-400 hover:text-brand dark:hover:text-brand-light transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
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
