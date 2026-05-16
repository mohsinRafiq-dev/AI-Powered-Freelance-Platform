import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Briefcase, Building2, X, Plus, DollarSign, MapPin, Phone, User } from 'lucide-react';
import { completeUserProfile, fetchCurrentUser } from '../../../store/slices/authSlice';
import { Button } from '../../../components/ui/button';
import { Input, Textarea } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { ButtonLoader } from '../../../components/common/Loader';
import logger from '@/utils/logger';

// Validation schemas
const freelancerSchema = yup.object({
  role: yup.string().required(),
  bio: yup.string().max(500),
  location: yup.string(),
  phone: yup.string(),
  skills: yup.array().of(yup.string()).min(1, 'Add at least one skill'),
  hourlyRate: yup.number().positive('Hourly rate must be positive').required('Hourly rate is required'),
  experience: yup.string().oneOf(['beginner', 'intermediate', 'expert']).required('Experience level is required'),
});

const clientSchema = yup.object({
  role: yup.string().required(),
  bio: yup.string().max(500),
  location: yup.string(),
  phone: yup.string(),
  companyName: yup.string().required('Company name is required'),
  companySize: yup.string().oneOf(['1-10', '11-50', '51-200', '201-500', '500+']).required('Company size is required'),
  industry: yup.string().required('Industry is required'),
});

export default function CompleteProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);
  
  const [selectedRole, setSelectedRole] = useState('');
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form with dynamic schema based on role
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: yupResolver(selectedRole === 'freelancer' ? freelancerSchema : clientSchema),
    mode: 'onBlur',
  });

  useEffect(() => {
    // Redirect admin users with adminRole to admin dashboard
    const isAdmin = user?.role === 'admin' && user?.adminRole;
    if (isAdmin) {
      logger.debug('Admin user detected, redirecting to admin dashboard');
      toast.success('Welcome Admin!');
      navigate('/admin/dashboard', { replace: true });
      return;
    }
    
    // Only redirect if BOTH flags are true and role exists
    const isComplete = user?.isProfileComplete === true && 
                       user?.role && 
                       ['freelancer', 'client'].includes(user.role);
    
    logger.debug('CompleteProfile mount check:', { 
      user, 
      isProfileComplete: user?.isProfileComplete, 
      role: user?.role,
      shouldRedirect: isComplete
    });
    
    if (isComplete) {
      logger.debug('Profile is already complete, redirecting to dashboard');
      toast.success('Profile already complete!');
      navigate('/dashboard', { replace: true });
    }
  }, [user?.isProfileComplete, user?.role, navigate]);

  useEffect(() => {
    // Set role in form when selected
    if (selectedRole) {
      setValue('role', selectedRole);
    }
  }, [selectedRole, setValue]);

  useEffect(() => {
    // Update skills in form
    setValue('skills', skills);
  }, [skills, setValue]);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      const profileData = {
        role: selectedRole,
        bio: data.bio,
        location: data.location,
        phone: data.phone,
      };

      if (selectedRole === 'freelancer') {
        profileData.skills = skills;
        profileData.hourlyRate = parseFloat(data.hourlyRate);
        profileData.experience = data.experience;
      } else {
        profileData.companyName = data.companyName;
        profileData.companySize = data.companySize;
        profileData.industry = data.industry;
      }

      logger.debug('Submitting profile data:', profileData);

      // Complete the profile and wait for response
      const result = await dispatch(completeUserProfile(profileData)).unwrap();
      
      logger.debug('Profile completion result:', result);
      
      if (!result?.user?.isProfileComplete) {
        throw new Error('Profile completion failed - profile not marked as complete');
      }
      
      // Show success message
      toast.success('Profile completed successfully! Redirecting...');
      
      // Small delay to ensure Redux state is fully updated
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Force refresh current user to sync state
      await dispatch(fetchCurrentUser()).unwrap();
      
      logger.debug('User data refreshed - navigating to dashboard');
      
      // Navigate with replace to prevent back button issues
      navigate('/dashboard', { replace: true });
      
    } catch (error) {
      logger.error('Profile completion error:', error);
      toast.error(error?.message || error || 'Failed to complete profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="min-h-screen pt-0 md:pt-24 lg:pt-28 pb-24 md:pb-12 bg-gradient-to-br from-brand-light/30 via-white to-brand/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-brand/5 dark:bg-brand/10 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-brand-dark/5 dark:bg-brand-dark/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-2xl relative z-10"
      >
        <div className="text-center">
          <motion.div 
            className="inline-flex p-4 bg-gradient-brand rounded-2xl shadow-brand mx-auto mb-6"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <User className="h-10 w-10 text-white" />
          </motion.div>
          <h2 className="text-4xl font-extrabold text-brand-deepest dark:text-white">
            Complete Your Profile
          </h2>
          <p className="mt-3 text-lg text-brand-deeper dark:text-gray-300">
            Tell us more about yourself to get started with <span className="font-semibold text-brand dark:text-brand-light">Linkify</span>
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl relative z-10"
      >
        <Card glass className="border-2 border-brand-light/30 dark:border-brand-deeper shadow-[0_8px_32px_0_rgba(31,38,135,0.2)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">
          <CardHeader>
            <CardTitle className="text-2xl text-brand-deepest dark:text-white">Choose Your Role</CardTitle>
            <CardDescription className="text-brand-deeper dark:text-gray-300">Select how you want to use Linkify</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Role Selection */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <motion.button
                  type="button"
                  onClick={() => handleRoleSelect('freelancer')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative rounded-2xl border-2 p-8 cursor-pointer transition-all duration-300 ${
                    selectedRole === 'freelancer'
                      ? 'border-brand bg-gradient-to-br from-brand-light/30 to-brand/10 dark:from-brand/20 dark:to-brand-dark/20 shadow-brand'
                      : 'border-brand-light/50 dark:border-brand-deeper bg-white dark:bg-gray-800 hover:border-brand/50'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className={`p-3 rounded-xl mb-4 transition-all ${selectedRole === 'freelancer' ? 'bg-gradient-brand shadow-brand' : 'bg-brand-light/30 dark:bg-brand-deeper'}`}>
                      <Briefcase className={`h-12 w-12 ${selectedRole === 'freelancer' ? 'text-white' : 'text-brand dark:text-brand-light'}`} />
                    </div>
                    <h3 className="text-xl font-bold text-brand-deepest dark:text-white mb-2">Freelancer</h3>
                    <p className="text-sm text-brand-deeper dark:text-gray-300 text-center">
                      Find work and showcase your skills
                    </p>
                  </div>
                  {selectedRole === 'freelancer' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4 bg-brand rounded-full p-1.5 shadow-brand"
                    >
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  )}
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => handleRoleSelect('client')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative rounded-2xl border-2 p-8 cursor-pointer transition-all duration-300 ${
                    selectedRole === 'client'
                      ? 'border-brand bg-gradient-to-br from-brand-light/30 to-brand/10 dark:from-brand/20 dark:to-brand-dark/20 shadow-brand'
                      : 'border-brand-light/50 dark:border-brand-deeper bg-white dark:bg-gray-800 hover:border-brand/50'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className={`p-3 rounded-xl mb-4 transition-all ${selectedRole === 'client' ? 'bg-gradient-brand shadow-brand' : 'bg-brand-light/30 dark:bg-brand-deeper'}`}>
                      <Building2 className={`h-12 w-12 ${selectedRole === 'client' ? 'text-white' : 'text-brand dark:text-brand-light'}`} />
                    </div>
                    <h3 className="text-xl font-bold text-brand-deepest dark:text-white mb-2">Client</h3>
                    <p className="text-sm text-brand-deeper dark:text-gray-300 text-center">
                      Hire talented freelancers for your projects
                    </p>
                  </div>
                  {selectedRole === 'client' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4 bg-brand rounded-full p-1.5 shadow-brand"
                    >
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  )}
                </motion.button>
              </div>

              <AnimatePresence mode="wait">
                {selectedRole && (
                  <motion.div
                    key={selectedRole}
                    variants={roleVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Common Fields */}
                      <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <User className="h-5 w-5 text-brand dark:text-brand-light" />
                          Basic Information
                        </h3>                      <div>
                        <Label htmlFor="bio">Bio (Optional)</Label>
                        <Textarea
                          glass
                          id="bio"
                          {...register('bio')}
                          placeholder="Tell us about yourself..."
                          className="mt-1"
                        />
                        {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>}
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <Label htmlFor="location" className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Location
                          </Label>
                          <Input
                            glass
                            id="location"
                            {...register('location')}
                            placeholder="City, Country"
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="phone" className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Phone
                          </Label>
                          <Input
                            glass
                            id="phone"
                            {...register('phone')}
                            placeholder="+1 234 567 890"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Freelancer-specific fields */}
                    {selectedRole === 'freelancer' && (
                      <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <Briefcase className="h-5 w-5 text-brand dark:text-brand-light" />
                          Freelancer Details
                        </h3>

                        <div>
                          <Label htmlFor="skillInput">Skills *</Label>
                          <div className="mt-1 flex gap-2">
                            <Input
                              glass
                              id="skillInput"
                              value={skillInput}
                              onChange={(e) => setSkillInput(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                              placeholder="e.g., React, Node.js, UI/UX Design"
                            />
                            <Button glass type="button" onClick={handleAddSkill}>
                              <Plus className="h-4 w-4 mr-2" />
                              Add
                            </Button>
                          </div>
                          {errors.skills && <p className="mt-1 text-sm text-red-600">{errors.skills.message}</p>}
                          {skills.length > 0 && (
                            <motion.div layout className="mt-3 flex flex-wrap gap-2">
                              {skills.map((skill) => (
                                <motion.div
                                  key={skill}
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                >
                                  <Badge glass variant="default" className="flex items-center gap-1">
                                    {skill}
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveSkill(skill)}
                                      className="ml-1 hover:text-red-200"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </Badge>
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <Label htmlFor="hourlyRate" className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              Hourly Rate *
                            </Label>
                            <Input
                              glass
                              id="hourlyRate"
                              type="number"
                              step="0.01"
                              {...register('hourlyRate')}
                              placeholder="50"
                              className="mt-1"
                            />
                            {errors.hourlyRate && <p className="mt-1 text-sm text-red-600">{errors.hourlyRate.message}</p>}
                          </div>

                          <div>
                            <Label htmlFor="experience">Experience Level *</Label>
                            <select
                              id="experience"
                              {...register('experience')}
                              className="mt-1 flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand dark:border-brand-deeper dark:bg-brand-deepest dark:text-brand-light transition-all"
                            >
                              <option value="">Select level</option>
                              <option value="beginner">Beginner (0-2 years)</option>
                              <option value="intermediate">Intermediate (2-5 years)</option>
                              <option value="expert">Expert (5+ years)</option>
                            </select>
                            {errors.experience && <p className="mt-1 text-sm text-red-600">{errors.experience.message}</p>}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Client-specific fields */}
                    {selectedRole === 'client' && (
                      <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-brand dark:text-brand-light" />
                          Company Details
                        </h3>

                        <div>
                          <Label htmlFor="companyName">Company Name *</Label>
                          <Input
                            glass
                            id="companyName"
                            {...register('companyName')}
                            placeholder="Acme Inc."
                            className="mt-1"
                          />
                          {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <Label htmlFor="companySize">Company Size *</Label>
                            <select
                              id="companySize"
                              {...register('companySize')}
                              className="mt-1 flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand dark:border-brand-deeper dark:bg-brand-deepest dark:text-brand-light transition-all"
                            >
                              <option value="">Select size</option>
                              <option value="1-10">1-10 employees</option>
                              <option value="11-50">11-50 employees</option>
                              <option value="51-200">51-200 employees</option>
                              <option value="201-500">201-500 employees</option>
                              <option value="500+">500+ employees</option>
                            </select>
                            {errors.companySize && <p className="mt-1 text-sm text-red-600">{errors.companySize.message}</p>}
                          </div>

                          <div>
                            <Label htmlFor="industry">Industry *</Label>
                            <Input
                              glass
                              id="industry"
                              {...register('industry')}
                              placeholder="Technology, Healthcare, etc."
                              className="mt-1"
                            />
                            {errors.industry && <p className="mt-1 text-sm text-red-600">{errors.industry.message}</p>}
                          </div>
                        </div>
                      </div>
                    )}

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Button
                        glass
                        type="submit"
                        className="w-full touch-target text-white shadow-brand hover:shadow-brand-lg transition-all duration-300 hover:scale-[1.02] font-semibold text-lg"
                        size="lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <ButtonLoader text="Completing Profile" />
                        ) : (
                          'Complete Profile & Continue'
                        )}
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
