import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Sparkles, Rocket } from 'lucide-react';
import { useCreateJob } from '@/hooks/api';
import { SkillSelector, BudgetInput } from '../components';
import { Button } from '../../../components/ui/button';
import { ButtonLoader } from '../../../components/common/Loader';
import logger from '@/utils/logger';

const CATEGORIES = [
  { label: 'Web Development', value: 'web-development' },
  { label: 'Mobile Development', value: 'mobile-development' },
  { label: 'Design', value: 'design' },
  { label: 'Writing', value: 'writing' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Video Editing', value: 'video-editing' },
  { label: 'Data Entry', value: 'data-entry' },
  { label: 'Customer Service', value: 'customer-service' },
  { label: 'Virtual Assistant', value: 'virtual-assistant' },
  { label: 'Other', value: 'other' }
];

const DURATIONS = [
  { label: 'Less than 1 week', value: 'less-than-week' },
  { label: '1-2 weeks', value: '1-2-weeks' },
  { label: '2-4 weeks', value: '2-4-weeks' },
  { label: '1-3 months', value: '1-3-months' },
  { label: '3-6 months', value: '3-6-months' },
  { label: 'More than 6 months', value: 'more-than-6-months' }
];

const EXPERIENCE_LEVELS = [
  { label: 'Entry', value: 'entry' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Expert', value: 'expert' }
];

const LOCATION_TYPES = [
  { label: 'Remote', value: 'remote' },
  { label: 'Onsite', value: 'onsite' },
  { label: 'Hybrid', value: 'hybrid' }
];

const PROJECT_SIZES = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' }
];

export const CreateJob = () => {
  const navigate = useNavigate();
  const createJobMutation = useCreateJob();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    skills: [],
    budgetType: 'fixed',
    budgetAmount: '',
    hourlyRate: { min: '', max: '' },
    duration: '',
    experienceLevel: 'intermediate',
    projectSize: 'medium',
    locationType: 'remote',
    location: {
      country: '',
      city: '',
      timezone: ''
    }
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clean up data to match backend validation - ONLY send fields backend expects
    const jobData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      skills: formData.skills.map(s => s.toLowerCase().trim()),
      budgetType: formData.budgetType,
      experienceLevel: formData.experienceLevel,
      projectSize: formData.projectSize,
      locationType: formData.locationType,
      location: {
        country: formData.location.country || undefined,
        city: formData.location.city || undefined,
        timezone: formData.location.timezone || undefined
      }
    };

    // Add duration if selected
    if (formData.duration) {
      jobData.duration = formData.duration;
    }

    // Add budget based on type
    if (formData.budgetType === 'fixed') {
      jobData.budgetAmount = parseFloat(formData.budgetAmount);
    } else {
      jobData.hourlyRate = {
        min: parseFloat(formData.hourlyRate.min),
        max: parseFloat(formData.hourlyRate.max)
      };
    }

    try {
      logger.debug('Submitting job data:', jobData);
      const result = await createJobMutation.mutateAsync(jobData);
      logger.debug('Job created:', result);
      
      // Wait a bit for cache to invalidate before navigating
      setTimeout(() => {
        navigate('/jobs/my-jobs');
      }, 500);
    } catch (error) {
      logger.error('Failed to create job:', error);
      logger.error('Validation errors:', error.response?.data?.errors);
      logger.error('Submitted data:', jobData);
    }
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return formData.title.length >= 5 && formData.description.length >= 50 && 
             formData.category && formData.skills.length > 0;
    }
    if (currentStep === 2) {
      if (formData.budgetType === 'fixed') {
        return formData.budgetAmount >= 5 && formData.duration;
      }
      return formData.hourlyRate.min >= 5 && formData.hourlyRate.max >= 5 && formData.duration;
    }
    if (currentStep === 3) {
      // Check location type is selected
      if (!formData.experienceLevel || !formData.projectSize || !formData.locationType) {
        return false;
      }
      // If onsite or hybrid, require country and city
      if (formData.locationType === 'onsite' || formData.locationType === 'hybrid') {
        return formData.location.country?.trim() && formData.location.city?.trim();
      }
      return true;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 lg:pt-28 pb-24 md:pb-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-700 dark:text-gray-300 hover:text-brand dark:hover:text-brand-light hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Post a New Job
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find the perfect freelancer for your project
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div key={index} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full font-semibold shadow-md transition-all ${
                  index + 1 <= currentStep
                    ? 'bg-brand text-white'
                    : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                  {index + 1 < currentStep ? <Check className="w-6 h-6" /> : index + 1}
                </div>
                {index < totalSteps - 1 && (
                  <div className={`h-2 flex-1 mx-2 rounded-full transition-all ${
                    index + 1 < currentStep ? 'bg-brand' : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Basic Info</span>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Budget</span>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Details</span>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Review</span>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-lg"
        >
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-gray-900 dark:text-white mb-2 block">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="e.g., Build a React Dashboard"
                  className={`w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border ${
                    formData.title.length > 0 && formData.title.length < 5
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-600 focus:border-brand dark:focus:border-brand-light'
                  } text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all`}
                  required
                  minLength={5}
                  maxLength={100}
                />
                <p className={`text-xs mt-1 ${
                  formData.title.length > 0 && formData.title.length < 5
                    ? 'text-red-500'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {formData.title.length}/100 characters (min 5)
                  {formData.title.length > 0 && formData.title.length < 5 && (
                    <span className="ml-2">⚠️ Need {5 - formData.title.length} more characters</span>
                  )}
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-900 dark:text-white mb-2 block">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Describe your project in detail..."
                  rows={8}
                  className={`w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border ${
                    formData.description.length > 0 && formData.description.length < 50
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-600 focus:border-brand dark:focus:border-brand-light'
                  } text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all resize-none`}
                  required
                  minLength={50}
                  maxLength={5000}
                />
                <p className={`text-xs mt-1 ${
                  formData.description.length > 0 && formData.description.length < 50
                    ? 'text-red-500'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {formData.description.length}/5000 characters (min 50)
                  {formData.description.length > 0 && formData.description.length < 50 && (
                    <span className="ml-2">⚠️ Need {50 - formData.description.length} more characters</span>
                  )}
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-900 dark:text-white mb-2 block">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand dark:focus:border-brand-light transition-all appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1.5rem 1.5rem',
                    paddingRight: '2.5rem'
                  }}
                  required
                >
                  <option value="" className="text-gray-500">Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value} className="text-gray-900 dark:text-white bg-white dark:bg-gray-700">
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-900 dark:text-white mb-2 block">
                  Required Skills <span className="text-red-500">*</span>
                </label>
                <SkillSelector
                  selectedSkills={formData.skills}
                  onChange={(skills) => updateField('skills', skills)}
                />
              </div>
            </div>
          )}

          {/* Step 2: Budget */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <BudgetInput
                budgetType={formData.budgetType}
                budgetAmount={formData.budgetAmount}
                hourlyRate={formData.hourlyRate}
                onChange={(updates) => setFormData(prev => ({ ...prev, ...updates }))}
              />

              <div>
                <label className="text-sm font-semibold text-gray-900 dark:text-white mb-2 block">
                  Project Duration <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => updateField('duration', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand dark:focus:border-brand-light transition-all appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1.5rem 1.5rem',
                    paddingRight: '2.5rem'
                  }}
                  required
                >
                  <option value="" className="text-gray-500">Select duration</option>
                  {DURATIONS.map((dur) => (
                    <option key={dur.value} value={dur.value} className="text-gray-900 dark:text-white bg-white dark:bg-gray-700">
                      {dur.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Details */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-gray-900 dark:text-white mb-3 block">
                  Experience Level <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {EXPERIENCE_LEVELS.map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => updateField('experienceLevel', level.value)}
                      className={`px-4 py-3 rounded-lg font-medium capitalize transition-colors ${
                        formData.experienceLevel === level.value
                          ? 'bg-brand text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-900 dark:text-white mb-3 block">
                  Project Size <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {PROJECT_SIZES.map((size) => (
                    <button
                      key={size.value}
                      type="button"
                      onClick={() => updateField('projectSize', size.value)}
                      className={`px-4 py-3 rounded-lg font-medium capitalize transition-colors ${
                        formData.projectSize === size.value
                          ? 'bg-brand text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-900 dark:text-white mb-3 block">
                  Location Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {LOCATION_TYPES.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => updateField('locationType', type.value)}
                      className={`px-4 py-3 rounded-lg font-medium capitalize transition-colors ${
                        formData.locationType === type.value
                          ? 'bg-brand text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Details - Show for onsite and hybrid */}
              {(formData.locationType === 'onsite' || formData.locationType === 'hybrid') && (
                <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
                    📍 Location details required for {formData.locationType} positions
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-900 dark:text-white mb-2 block">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.location.country}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          location: { ...prev.location, country: e.target.value } 
                        }))}
                        className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand dark:focus:border-brand-light transition-all"
                        placeholder="e.g., United States, Pakistan, India"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-900 dark:text-white mb-2 block">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.location.city}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          location: { ...prev.location, city: e.target.value } 
                        }))}
                        className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand dark:focus:border-brand-light transition-all"
                        placeholder="e.g., Karachi, Lahore, Islamabad, or Remote"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand rounded-full mb-4 shadow-lg">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Review Your Job Post
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Please review all details before posting
                </p>
              </div>
              
              <div className="space-y-4">
                {/* Title */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 border border-gray-200 dark:border-gray-600">
                  <p className="text-xs font-bold text-brand dark:text-brand-light mb-2 uppercase tracking-wider">
                    Job Title
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white break-words">
                    {formData.title}
                  </p>
                </div>

                {/* Description */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 border border-gray-200 dark:border-gray-600">
                  <p className="text-xs font-bold text-brand dark:text-brand-light mb-2 uppercase tracking-wider">
                    Description
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed break-words">
                    {formData.description}
                  </p>
                </div>

                {/* Category & Budget Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 border border-gray-200 dark:border-gray-600">
                    <p className="text-xs font-bold text-brand dark:text-brand-light mb-2 uppercase tracking-wider">
                      Category
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white capitalize break-words">
                      {CATEGORIES.find(c => c.value === formData.category)?.label || formData.category}
                    </p>
                  </div>

                  <div className="bg-brand/10 dark:bg-brand-light/10 rounded-xl p-5 border border-brand/30 dark:border-brand-light/30">
                    <p className="text-xs font-bold text-brand dark:text-brand-light mb-2 uppercase tracking-wider">
                      Budget
                    </p>
                    <p className="text-sm font-bold text-brand-dark dark:text-brand-light break-words">
                      {formData.budgetType === 'fixed' 
                        ? `$${formData.budgetAmount} Fixed`
                        : `$${formData.hourlyRate.min}-$${formData.hourlyRate.max}/hr`
                      }
                    </p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                    <p className="text-xs font-bold text-brand dark:text-brand-light mb-2 uppercase tracking-wider">
                      Duration
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white capitalize break-words">
                      {DURATIONS.find(d => d.value === formData.duration)?.label || formData.duration}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                    <p className="text-xs font-bold text-brand dark:text-brand-light mb-2 uppercase tracking-wider">
                      Experience
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white capitalize break-words">
                      {formData.experienceLevel}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                    <p className="text-xs font-bold text-brand dark:text-brand-light mb-2 uppercase tracking-wider">
                      Location
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white capitalize break-words">
                      {formData.locationType}
                      {(formData.locationType === 'onsite' || formData.locationType === 'hybrid') && 
                       formData.location.city && formData.location.country && (
                        <span className="block text-xs text-gray-600 dark:text-gray-400 mt-1 normal-case">
                          {formData.location.city}, {formData.location.country}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Skills */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 border border-gray-200 dark:border-gray-600">
                  <p className="text-xs font-bold text-brand dark:text-brand-light mb-3 uppercase tracking-wider">
                    Required Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, i) => (
                      <span 
                        key={i} 
                        className="px-3 py-2 bg-brand/20 text-brand-dark dark:bg-brand-light/20 dark:text-brand-light rounded-lg text-sm font-bold border border-brand/30 dark:border-brand-light/30"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Warning Note */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-xl p-5 shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white text-lg font-bold">!</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-amber-900 dark:text-amber-200 mb-1">
                      Important Notice
                    </p>
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                      Once posted, you won't be able to change the budget or category if proposals are received.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {currentStep > 1 && (
              <div className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="w-full border border-brand text-brand hover:bg-brand/10 dark:border-brand-light dark:text-brand-light dark:hover:bg-brand-light/10 font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  ← Previous
                </Button>
              </div>
            )}
            
            {currentStep < totalSteps && (
              <div className="flex-1">
                <Button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  disabled={!canProceed()}
                  className="w-full bg-brand text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all font-semibold"
                >
                  Next →
                </Button>
              </div>
            )}

            {currentStep === totalSteps && (
              <div className="flex-1">
                <Button
                  type="submit"
                  disabled={createJobMutation.isLoading}
                  className="w-full bg-brand text-white disabled:opacity-50 shadow-lg hover:shadow-xl transition-all font-bold text-lg py-6"
                >
                  <span className="flex items-center justify-center gap-2">
                    {createJobMutation.isLoading ? (
                      <ButtonLoader text="Posting Job" />
                    ) : (
                      <>
                        <Rocket className="w-5 h-5" />
                        Post Job
                        <Sparkles className="w-5 h-5" />
                      </>
                    )}
                  </span>
                </Button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
