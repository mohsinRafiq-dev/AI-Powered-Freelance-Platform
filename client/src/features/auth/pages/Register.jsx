import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { 
  UserPlus, Mail, Lock, User, Phone, MapPin, 
  Briefcase, Building2, DollarSign, X, Plus, Chrome 
} from "lucide-react";
import { registerUser } from "../../../store/slices/authSlice";
import { freelancerRegistrationSchema, clientRegistrationSchema } from "../../../utils/validation";
import { Button } from "../../../components/ui/button";
import { Input, Textarea } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { ButtonLoader } from "../../../components/common/Loader";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, isAuthenticated, isProfileComplete, user } = useSelector((state) => state.auth);
  const [selectedRole, setSelectedRole] = useState("freelancer");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  const currentSchema = selectedRole === "freelancer" ? freelancerRegistrationSchema : clientRegistrationSchema;

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: yupResolver(currentSchema),
    mode: "onBlur",
    defaultValues: {
      role: "freelancer",
      experience: "beginner",
      hourlyRate: "",
      companySize: "1-10",
      companyName: "",
      industry: "",
    },
  });

  const watchRole = watch("role");

  // Update selected role when form role changes
  useEffect(() => {
    if (watchRole) {
      setSelectedRole(watchRole);
    }
  }, [watchRole]);

  // Redirect if already authenticated - Check both Redux state and user object
  useEffect(() => {
    if (isAuthenticated && user) {
      // Check if profile is truly complete
      const profileComplete = Boolean(
        (isProfileComplete || user.isProfileComplete) && 
        user.role && 
        ['freelancer', 'client', 'admin'].includes(user.role)
      );
      
      if (profileComplete) {
        // Admin must have BOTH role and adminRole
        const isAdmin = user?.role === 'admin' && user?.adminRole;
        const redirectPath = isAdmin ? '/admin/dashboard' : '/dashboard';
        navigate(redirectPath, { replace: true });
      } else {
        navigate('/complete-profile', { replace: true });
      }
    }
  }, [isAuthenticated, isProfileComplete, user, navigate]);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setValue("role", role);
  };

  const handleSkillAdd = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleSkillKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSkillAdd();
    }
  };

  const onSubmit = async (data) => {
    try {
      // Validate freelancer has at least one skill
      if (data.role === "freelancer" && skills.length === 0) {
        toast.error("Please add at least one skill");
        return;
      }
      
      const registrationData = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        bio: data.bio || '',
        location: data.location || '',
        phone: data.phone || '',
      };

      // Add role-specific data
      if (data.role === "freelancer") {
        registrationData.skills = skills;
        registrationData.hourlyRate = parseFloat(data.hourlyRate);
        registrationData.experience = data.experience;
      } else if (data.role === "client") {
        registrationData.companyName = data.companyName;
        registrationData.companySize = data.companySize;
        registrationData.industry = data.industry;
      }

      const result = await dispatch(registerUser(registrationData)).unwrap();
      
      toast.success("Account created successfully!");
      
      // Small delay to ensure Redux state is updated
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Navigation handled by useEffect above
    } catch (err) {
      toast.error(err || "Registration failed. Please try again.");
    }
  };

  const handleGoogleSignup = () => {
    try {
      localStorage.setItem("redirectAfterAuth", "/complete-profile");
      
      // Runtime check for production
      const isProduction = window.location.hostname !== 'localhost';
      const apiUrl = isProduction 
        ? 'https://linkify-server-production.up.railway.app/api'
        : import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      window.location.href = `${apiUrl}/auth/google`;
    } catch (err) {
      toast.error("Failed to initiate Google signup");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const roleCardVariants = {
    unselected: { scale: 1, opacity: 0.7 },
    selected: { scale: 1.05, opacity: 1 },
  };

  return (
    <div className="min-h-screen pt-0 md:pt-24 lg:pt-28 pb-24 md:pb-4 bg-gradient-to-br from-brand-light/30 via-white to-brand/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 py-12 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-brand/5 dark:bg-brand/10 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-brand-dark/5 dark:bg-brand-dark/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1.5s' }} />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-3xl relative z-10"
      >
        <Card glass className="border-2 border-brand-light/30 dark:border-brand-deeper shadow-[0_8px_32px_0_rgba(31,38,135,0.2)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.25)] dark:hover:shadow-[0_12px_40px_0_rgba(0,0,0,0.5)] transition-all duration-400">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-6">
              <motion.div 
                className="bg-gradient-brand p-4 rounded-2xl shadow-brand"
                whileHover={{ scale: 1.05, rotate: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <UserPlus className="h-8 w-8 text-white" />
              </motion.div>
            </div>
            <CardTitle className="text-3xl font-bold text-brand-deepest dark:text-white">Join Linkify</CardTitle>
            <CardDescription className="text-center text-brand-deeper dark:text-gray-300 text-base">
              Create your account and start your journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-3">
                <Label className="text-lg font-semibold text-brand-deepest dark:text-white">I want to...</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div
                    variants={roleCardVariants}
                    animate={selectedRole === "freelancer" ? "selected" : "unselected"}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleRoleSelect("freelancer")}
                    className={`cursor-pointer p-6 border-2 rounded-2xl transition-all duration-300 ${
                      selectedRole === "freelancer"
                        ? "border-brand bg-gradient-to-br from-brand-light/30 to-brand/10 dark:from-brand/20 dark:to-brand-dark/20 shadow-brand"
                        : "border-brand-light/50 dark:border-brand-deeper hover:border-brand/50 bg-white dark:bg-gray-800"
                    }`}
                  >
                    <input
                      type="radio"
                      {...register("role")}
                      value="freelancer"
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className={`inline-flex p-3 rounded-xl mb-4 transition-all ${selectedRole === "freelancer" ? "bg-gradient-brand shadow-brand" : "bg-brand-light/30 dark:bg-brand-deeper"}`}>
                        <Briefcase className={`h-10 w-10 ${selectedRole === "freelancer" ? "text-white" : "text-brand dark:text-brand-light"}`} />
                      </div>
                      <h3 className="font-bold text-xl mb-2 text-brand-deepest dark:text-white">Freelancer</h3>
                      <p className="text-sm text-brand-deeper dark:text-gray-300">Offer services and find work</p>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={roleCardVariants}
                    animate={selectedRole === "client" ? "selected" : "unselected"}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleRoleSelect("client")}
                    className={`cursor-pointer p-6 border-2 rounded-2xl transition-all duration-300 ${
                      selectedRole === "client"
                        ? "border-brand bg-gradient-to-br from-brand-light/30 to-brand/10 dark:from-brand/20 dark:to-brand-dark/20 shadow-brand"
                        : "border-brand-light/50 dark:border-brand-deeper hover:border-brand/50 bg-white dark:bg-gray-800"
                    }`}
                  >
                    <input
                      type="radio"
                      {...register("role")}
                      value="client"
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className={`inline-flex p-3 rounded-xl mb-4 transition-all ${selectedRole === "client" ? "bg-gradient-brand shadow-brand" : "bg-brand-light/30 dark:bg-brand-deeper"}`}>
                        <Building2 className={`h-10 w-10 ${selectedRole === "client" ? "text-white" : "text-brand dark:text-brand-light"}`} />
                      </div>
                      <h3 className="font-bold text-xl mb-2 text-brand-deepest dark:text-white">Client</h3>
                      <p className="text-sm text-brand-deeper dark:text-gray-300">Hire talent for projects</p>
                    </div>
                  </motion.div>
                </div>
                {errors.role && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span>⚠</span> {errors.role.message}
                  </p>
                )}
              </div>

              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Ahmed Khan"
                      {...register("name")}
                      disabled={isLoading}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      {...register("email")}
                      disabled={isLoading}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      {...register("password")}
                      disabled={isLoading}
                    />
                    {errors.password && (
                      <p className="text-sm text-red-600">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      {...register("confirmPassword")}
                      disabled={isLoading}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Profile Details</h3>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio (Optional)</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    rows={3}
                    {...register("bio")}
                    disabled={isLoading}
                  />
                  {errors.bio && (
                    <p className="text-sm text-red-600">{errors.bio.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location (Optional)
                    </Label>
                    <Input
                      id="location"
                      type="text"
                      placeholder="Karachi, Lahore, or Islamabad"
                      {...register("location")}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone (Optional)
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 234 567 8900"
                      {...register("phone")}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Role-Specific Fields */}
              {/* Freelancer Fields */}
              <div className={selectedRole === "freelancer" ? "space-y-4" : "hidden"}>
                <h3 className="text-lg font-semibold">Freelancer Information</h3>

                {/* Skills */}
                <div className="space-y-2">
                      <Label htmlFor="skills" className="flex items-center gap-2">
                        Skills <span className="text-red-500">*</span>
                        <span className="text-xs text-gray-500">(Add at least one)</span>
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="skills"
                          type="text"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyPress={handleSkillKeyPress}
                          placeholder="Add a skill (e.g., JavaScript, React, Node.js)"
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          onClick={handleSkillAdd}
                          disabled={isLoading || !skillInput.trim()}
                          variant="outline"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {skills.length === 0 && (
                        <p className="text-sm text-amber-600">⚠️ Please add at least one skill to complete registration</p>
                      )}
                      {skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="pl-3 pr-1 py-1">
                              {skill}
                              <button
                                type="button"
                                onClick={() => handleSkillRemove(skill)}
                                disabled={isLoading}
                                className="ml-1 hover:text-red-600"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hourlyRate" className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Hourly Rate <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="hourlyRate"
                          type="number"
                          placeholder="25"
                          min="1"
                          {...register("hourlyRate")}
                          disabled={isLoading}
                        />
                        {errors.hourlyRate && (
                          <p className="text-sm text-red-600">{errors.hourlyRate.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="experience">
                          Experience Level <span className="text-red-500">*</span>
                        </Label>
                        <select
                          id="experience"
                          {...register("experience")}
                          disabled={isLoading}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="beginner">Beginner (0-2 years)</option>
                          <option value="intermediate">Intermediate (2-5 years)</option>
                          <option value="expert">Expert (5+ years)</option>
                        </select>
                        {errors.experience && (
                          <p className="text-sm text-red-600">{errors.experience.message}</p>
                        )}
                      </div>
                    </div>
                </div>

              {/* Client Fields */}
              <div className={selectedRole === "client" ? "space-y-4" : "hidden"}>
                <h3 className="text-lg font-semibold">Company Information</h3>

                <div className="space-y-2">
                      <Label htmlFor="companyName" className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Company Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="companyName"
                        type="text"
                        placeholder="Acme Inc."
                        {...register("companyName")}
                        disabled={isLoading}
                      />
                      {errors.companyName && (
                        <p className="text-sm text-red-600">{errors.companyName.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companySize">
                          Company Size <span className="text-red-500">*</span>
                        </Label>
                        <select
                          id="companySize"
                          {...register("companySize")}
                          disabled={isLoading}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="1-10">1-10 employees</option>
                          <option value="11-50">11-50 employees</option>
                          <option value="51-200">51-200 employees</option>
                          <option value="201-500">201-500 employees</option>
                          <option value="500+">500+ employees</option>
                        </select>
                        {errors.companySize && (
                          <p className="text-sm text-red-600">{errors.companySize.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="industry">
                          Industry <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="industry"
                          type="text"
                          placeholder="Technology, Healthcare, Finance, etc."
                          {...register("industry")}
                          disabled={isLoading}
                        />
                        {errors.industry && (
                          <p className="text-sm text-red-600">{errors.industry.message}</p>
                        )}
                      </div>
                    </div>
                </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full touch-target bg-gradient-brand hover:opacity-90 text-white shadow-brand hover:shadow-brand-lg transition-all duration-300 hover:scale-[1.02] font-semibold text-lg" 
                size="lg" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <ButtonLoader text="Creating Account" />
                ) : (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" />
                    Create Account
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

            {/* Google Sign Up */}
            <Button
              type="button"
              variant="outline"
              className="w-full touch-target border-2 border-brand-light/50 dark:border-brand-deeper hover:border-brand hover:bg-brand-light/20 dark:hover:bg-brand-deeper/50 text-brand-deepest dark:text-white transition-all duration-300"
              size="lg"
              onClick={handleGoogleSignup}
              disabled={isLoading}
            >
              <Chrome className="mr-2 h-5 w-5" />
              Sign up with Google
            </Button>

            {/* Login Link */}
            <motion.div 
              className="mt-8 text-center text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className="text-brand-deeper dark:text-gray-300">Already have an account? </span>
              <Link
                to="/login"
                className="text-brand hover:text-brand-dark dark:text-brand-light dark:hover:text-brand font-bold hover:underline transition-colors inline-flex items-center gap-1"
              >
                Sign In
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </motion.div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-center text-sm text-brand-deeper dark:text-gray-400"
        >
          <p className="mb-2">By creating an account, you agree to our</p>
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
  );
}