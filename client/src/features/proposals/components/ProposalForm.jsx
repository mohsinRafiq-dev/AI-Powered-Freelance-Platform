import { useState, useEffect } from "react";
import { DollarSign, Clock, FileText, AlertCircle, Send, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { useGenerateProposalDraft, useRegenerateProposalDraft } from "@/hooks/api/useProposals";
import { useAIFeatureStatus } from "@/hooks/api/useAdminSettings";
import AIGenerationStatus from "./AIGenerationStatus";
import logger from "@/utils/logger";

/**
 * ProposalForm Component
 * Form for submitting/editing proposals
 */
export const ProposalForm = ({ job, onSubmit, loading, error, initialData = null }) => {
  const [formData, setFormData] = useState({
    coverLetter: initialData?.coverLetter || "",
    proposedPrice: initialData?.bidAmount || initialData?.proposedPrice || "",
    deliveryTime: initialData?.deliveryTime || "",
  });

  const [errors, setErrors] = useState({});
  const [aiGenerationStatus, setAIGenerationStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [aiError, setAIError] = useState(null);
  const [aiConfidence, setAIConfidence] = useState(null);

  // Check AI feature status
  const { data: aiStatus } = useAIFeatureStatus();
  const aiEnabled = aiStatus?.data?.aiEnabled && aiStatus?.data?.features?.proposalGeneration;

  // AI generation hooks
  const { mutateAsync: generateDraft, isLoading: isGenerating } = useGenerateProposalDraft();
  const { mutateAsync: regenerateDraft, isLoading: isRegenerating } = useRegenerateProposalDraft();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.coverLetter || formData.coverLetter.length < 100) {
      newErrors.coverLetter = "Cover letter must be at least 100 characters";
    }
    if (formData.coverLetter && formData.coverLetter.length > 2000) {
      newErrors.coverLetter = "Cover letter cannot exceed 2000 characters";
    }

    if (!formData.proposedPrice || formData.proposedPrice <= 0) {
      newErrors.proposedPrice = "Proposed price must be greater than 0";
    }
    if (formData.proposedPrice && formData.proposedPrice < 500) {
      newErrors.proposedPrice = "Proposed price must be at least PKR 500";
    }
    if (job?.budget && formData.proposedPrice > job.budget * 1.5) {
      newErrors.proposedPrice = `Proposed price seems too high for this job budget (PKR ${job.budget})`;
    }

    if (!formData.deliveryTime || formData.deliveryTime <= 0) {
      newErrors.deliveryTime = "Delivery time must be at least 1 day";
    }
    if (formData.deliveryTime > 365) {
      newErrors.deliveryTime = "Delivery time cannot exceed 365 days";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const jobId = job?._id || job?.id;
      
      if (!jobId) {
        setErrors({ general: "Job ID is missing" });
        return;
      }
      
      const proposalData = {
        jobId: jobId,
        coverLetter: formData.coverLetter.trim(),
        bidAmount: parseFloat(formData.proposedPrice),
        deliveryTime: parseInt(formData.deliveryTime),
      };
      
      onSubmit(proposalData);
    }
  };

  const characterCount = formData.coverLetter.length;
  const isEditing = !!initialData;

  // Handle AI generation
  const handleGenerateWithAI = async () => {
    if (!job?._id && !job?.id) {
      setAIError('Job information is missing');
      setAIGenerationStatus('error');
      return;
    }

    setAIGenerationStatus('loading');
    setAIError(null);

    try {
      const jobId = job._id || job.id;
      const result = await generateDraft(jobId);
      
      if (result?.data?.draft) {
        const draft = result.data.draft;
        setFormData({
          coverLetter: draft.coverLetter || formData.coverLetter,
          proposedPrice: draft.bidAmount || formData.proposedPrice,
          deliveryTime: draft.deliveryTime || formData.deliveryTime,
        });
        setAIConfidence(draft.confidence);
        setAIGenerationStatus('success');
      }
    } catch (err) {
      logger.error('AI generation error:', err);
      setAIError(err.response?.data?.message || 'Failed to generate proposal. Please try again or fill manually.');
      setAIGenerationStatus('error');
    }
  };

  // Handle regenerate
  const handleRegenerate = async () => {
    if (!job?._id && !job?.id) {
      setAIError('Job information is missing');
      setAIGenerationStatus('error');
      return;
    }

    setAIGenerationStatus('loading');
    setAIError(null);

    try {
      const jobId = job._id || job.id;
      const result = await regenerateDraft(jobId);
      
      if (result?.data?.draft) {
        const draft = result.data.draft;
        setFormData({
          coverLetter: draft.coverLetter || formData.coverLetter,
          proposedPrice: draft.bidAmount || formData.proposedPrice,
          deliveryTime: draft.deliveryTime || formData.deliveryTime,
        });
        setAIConfidence(draft.confidence);
        setAIGenerationStatus('success');
      }
    } catch (err) {
      logger.error('AI regeneration error:', err);
      setAIError(err.response?.data?.message || 'Failed to regenerate proposal. Please try again.');
      setAIGenerationStatus('error');
    }
  };

  const isAIGenerating = isGenerating || isRegenerating;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* AI Generation Button */}
      {aiEnabled && !isEditing && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand dark:text-brand-light" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                AI Proposal Assistant
              </h3>
            </div>
            {aiGenerationStatus === 'success' && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRegenerate}
                disabled={isAIGenerating}
                className="border-brand text-brand hover:bg-brand/10 dark:border-brand-light dark:text-brand-light"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isAIGenerating ? 'animate-spin' : ''}`} />
                Regenerate
              </Button>
            )}
          </div>
          
          {aiGenerationStatus === 'idle' && (
            <Button
              type="button"
              onClick={handleGenerateWithAI}
              disabled={isAIGenerating || !job}
              className="w-full bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand-deeper text-white shadow-lg hover:shadow-xl transition-all"
            >
              <Sparkles className={`w-5 h-5 mr-2 ${isAIGenerating ? 'animate-pulse' : ''}`} />
              {isAIGenerating ? 'Generating...' : 'Generate with AI'}
            </Button>
          )}

          <AIGenerationStatus
            status={aiGenerationStatus}
            confidence={aiConfidence}
            error={aiError}
            onRetry={handleGenerateWithAI}
          />

          {aiGenerationStatus === 'success' && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                💡 AI-generated content is editable. Review and customize before submitting.
              </p>
            </div>
          )}
        </div>
      )}

      {!aiEnabled && !isEditing && (
        <div className="p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            AI proposal generation is currently disabled. Please fill the form manually.
          </p>
        </div>
      )}
      {/* Job Budget Display */}
      {job && job.budget && (
        <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Client's Budget</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300 font-semibold text-xl">
            PKR {job.budget?.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            💡 Actual payment will be managed through milestones after hiring
          </p>
        </div>
      )}

      {/* Cover Letter */}
      <div>
        <Label htmlFor="coverLetter" className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4 text-brand dark:text-brand-light" />
          Cover Letter <span className="text-red-500">*</span>
        </Label>
        <textarea
          id="coverLetter"
          name="coverLetter"
          value={formData.coverLetter}
          onChange={handleChange}
          rows={10}
          className={`w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border ${
            errors.coverLetter 
              ? 'border-red-500 focus:border-red-500' 
              : 'border-gray-300 dark:border-gray-600 focus:border-brand dark:focus:border-brand-light'
          } text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all resize-none`}
          placeholder="Explain why you're the best fit for this job. Highlight your relevant experience and how you plan to approach this project..."
        />
        <div className="flex justify-between items-center mt-2">
          <span
            className={`text-sm font-medium ${
              characterCount < 100
                ? "text-red-500"
                : characterCount > 2000
                ? "text-red-500"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            {characterCount} / 2000 characters 
            {characterCount < 100 && (
              <span className="ml-2 text-xs">(minimum 100 required)</span>
            )}
          </span>
          {characterCount >= 100 && characterCount <= 2000 && (
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">
              ✓ Good length
            </span>
          )}
        </div>
        {errors.coverLetter && (
          <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.coverLetter}</span>
          </div>
        )}
      </div>

      {/* Bid Amount and Delivery Time Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Proposed Price */}
        <div>
          <Label htmlFor="proposedPrice" className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-brand dark:text-brand-light" />
            Your Proposed Price <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-semibold">
              PKR
            </span>
            <Input
              type="number"
              id="proposedPrice"
              name="proposedPrice"
              value={formData.proposedPrice}
              onChange={handleChange}
              min="500"
              step="100"
              placeholder="5000"
              className={`pl-14 ${
                errors.proposedPrice 
                  ? 'border-red-500 focus:border-red-500' 
                  : ''
              }`}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            This is your initial price estimate. Final payment terms will be set through milestones.
          </p>
          {errors.proposedPrice && (
            <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.proposedPrice}</span>
            </div>
          )}
        </div>

        {/* Delivery Time */}
        <div>
          <Label htmlFor="deliveryTime" className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand dark:text-brand-light" />
            Delivery Time (days) <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              type="number"
              id="deliveryTime"
              name="deliveryTime"
              value={formData.deliveryTime}
              onChange={handleChange}
              min="1"
              max="365"
              placeholder="e.g., 7"
              className={errors.deliveryTime ? 'border-red-500 focus:border-red-500' : ''}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm font-medium">
              days
            </span>
          </div>
          {errors.deliveryTime && (
            <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.deliveryTime}</span>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-brand hover:bg-brand-dark text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Submitting Proposal...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              {isEditing ? "Update Proposal" : "Submit Proposal"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProposalForm;
