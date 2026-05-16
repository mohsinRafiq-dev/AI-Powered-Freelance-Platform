import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Save, X, AlertCircle } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Label } from '../../../../components/ui/label';
import { useAdminSettings, useUpdateAdminSettings } from '@/hooks/api/useAdminSettings';
import { InlineLoader } from '../../../../components/common/Loader';
import logger from '@/utils/logger';

/**
 * AI Settings Form Component
 * Form for managing AI feature flags
 */
export const AISettingsForm = () => {
  const { data, isLoading, error } = useAdminSettings();
  const { mutateAsync: updateSettings, isLoading: isUpdating } = useUpdateAdminSettings();

  const [formData, setFormData] = useState({
    aiEnabled: false,
    aiJobRecommendations: false,
    aiFreelancerRecommendations: false,
    aiProposalGeneration: false,
    aiMatchScoreEnhancement: false,
    aiProvider: 'gemini',
  });

  const [saveStatus, setSaveStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Load settings when data is available
  useEffect(() => {
    if (data?.data?.settings) {
      const settings = data.data.settings;
      setFormData({
        aiEnabled: settings.aiEnabled || false,
        aiJobRecommendations: settings.aiJobRecommendations || false,
        aiFreelancerRecommendations: settings.aiFreelancerRecommendations || false,
        aiProposalGeneration: settings.aiProposalGeneration || false,
        aiMatchScoreEnhancement: settings.aiMatchScoreEnhancement || false,
        aiProvider: settings.aiProvider || 'gemini',
      });
    }
  }, [data]);

  const handleToggle = (field) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: !prev[field] };
      
      // If disabling global AI, disable all features
      if (field === 'aiEnabled' && !newData.aiEnabled) {
        newData.aiJobRecommendations = false;
        newData.aiFreelancerRecommendations = false;
        newData.aiProposalGeneration = false;
        newData.aiMatchScoreEnhancement = false;
      }
      
      return newData;
    });
    setSaveStatus('idle');
  };

  const handleProviderChange = (provider) => {
    setFormData((prev) => ({ ...prev, aiProvider: provider }));
    setSaveStatus('idle');
  };

  const handleSave = async () => {
    try {
      setSaveStatus('idle');
      setErrorMessage('');
      
      await updateSettings(formData);
      setSaveStatus('success');
      
      // Reset success message after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      logger.error('Failed to update AI settings:', error);
      setSaveStatus('error');
      setErrorMessage(error.response?.data?.message || 'Failed to update settings');
    }
  };

  const handleCancel = () => {
    // Reset to original values
    if (data?.data?.settings) {
      const settings = data.data.settings;
      setFormData({
        aiEnabled: settings.aiEnabled || false,
        aiJobRecommendations: settings.aiJobRecommendations || false,
        aiFreelancerRecommendations: settings.aiFreelancerRecommendations || false,
        aiProposalGeneration: settings.aiProposalGeneration || false,
        aiMatchScoreEnhancement: settings.aiMatchScoreEnhancement || false,
        aiProvider: settings.aiProvider || 'gemini',
      });
    }
    setSaveStatus('idle');
    setErrorMessage('');
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <InlineLoader message="Loading AI settings..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
          <AlertCircle className="w-5 h-5" />
          <span>Failed to load AI settings. Please refresh the page.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Global AI Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand to-brand-dark rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Global AI Features
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Master switch for all AI capabilities
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.aiEnabled}
              onChange={() => handleToggle('aiEnabled')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand/20 dark:peer-focus:ring-brand-light/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand dark:peer-checked:bg-brand-light"></div>
          </label>
        </div>
      </motion.div>

      {/* Individual Feature Toggles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <h4 className="text-md font-semibold text-gray-900 dark:text-white">
          Feature-Specific Controls
        </h4>
        
        {[
          { key: 'aiJobRecommendations', label: 'Job Recommendations AI', description: 'AI-powered job recommendations for freelancers' },
          { key: 'aiFreelancerRecommendations', label: 'Freelancer Recommendations AI', description: 'AI-powered freelancer recommendations for clients' },
          { key: 'aiProposalGeneration', label: 'Proposal Generation AI', description: 'AI-assisted proposal draft generation' },
          { key: 'aiMatchScoreEnhancement', label: 'Match Score Enhancement AI', description: 'AI-enhanced match score calculations' },
        ].map((feature, index) => (
          <motion.div
            key={feature.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="text-base font-semibold text-gray-900 dark:text-white cursor-pointer">
                  {feature.label}
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {feature.description}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  checked={formData[feature.key]}
                  onChange={() => handleToggle(feature.key)}
                  disabled={!formData.aiEnabled}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand/20 dark:peer-focus:ring-brand-light/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand dark:peer-checked:bg-brand-light ${!formData.aiEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
              </label>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* AI Provider Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl"
      >
        <Label className="text-base font-semibold text-gray-900 dark:text-white mb-3 block">
          AI Provider
        </Label>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Select the AI provider to use for all AI features
        </p>
        <div className="flex gap-4">
          {['gemini', 'openai'].map((provider) => (
            <button
              key={provider}
              onClick={() => handleProviderChange(provider)}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                formData.aiProvider === provider
                  ? 'border-brand bg-brand/10 dark:border-brand-light dark:bg-brand-light/10 text-brand dark:text-brand-light font-semibold'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-brand dark:hover:border-brand-light'
              }`}
            >
              {provider === 'gemini' ? 'Google Gemini' : 'OpenAI'}
              {provider === 'openai' && (
                <span className="ml-2 text-xs text-gray-500">(Coming Soon)</span>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Save Status */}
      {saveStatus === 'success' && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
            <span className="text-sm font-medium">Settings saved successfully!</span>
          </div>
        </div>
      )}

      {saveStatus === 'error' && errorMessage && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <Button
          onClick={handleSave}
          disabled={isUpdating}
          className="flex-1 bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand-deeper text-white"
        >
          {isUpdating ? (
            <>
              <InlineLoader size="small" />
              <span className="ml-2">Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
        <Button
          onClick={handleCancel}
          variant="outline"
          disabled={isUpdating}
          className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default AISettingsForm;



