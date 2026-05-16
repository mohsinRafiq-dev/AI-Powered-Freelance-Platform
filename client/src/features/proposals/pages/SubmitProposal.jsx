import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Briefcase, DollarSign, Calendar, CheckCircle, Sparkles, FileText, AlertCircle } from "lucide-react";
import { useSubmitProposal, useCheckIfApplied } from "@/hooks/api";
import { useJob } from "@/hooks/api";
import ProposalForm from "../components/ProposalForm";
import { Button } from "../../../components/ui/button";
import { formatDate } from "@/utils/formatters";
import logger from "@/utils/logger";

/**
 * Submit Proposal Page
 * Page for submitting a proposal to a job
 */
export const SubmitProposal = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  
  // Use React Query hooks
  const { data: jobData, isLoading: jobLoading, error: jobError } = useJob(jobId);
  const { data: applicationStatus, isLoading: checkingApplied } = useCheckIfApplied(jobId);
  const hasApplied = applicationStatus?.hasApplied;
  const { mutateAsync: submitProposal, isLoading: submitting, error: submitError } = useSubmitProposal();
  
  const job = jobData?.data?.job || jobData?.job || jobData;

  const handleSubmit = async (proposalData) => {
    // Ensure jobId is included (use URL param as fallback)
    const finalProposalData = {
      ...proposalData,
      jobId: proposalData.jobId || jobId,
    };
    
    logger.debug('Submitting proposal with data:', finalProposalData);
    
    try {
      await submitProposal(finalProposalData);
      logger.info("Proposal submitted successfully");
      setSuccess(true);
      
      // Navigate after success
      setTimeout(() => {
        navigate("/freelancer/proposals");
      }, 2000);
    } catch (error) {
      logger.error("Failed to submit proposal:", error);
      
      // Handle duplicate proposal error specifically
      if (error.response?.status === 400 && 
          error.response?.data?.message?.includes('already submitted')) {
        // Redirect to proposals page
        setTimeout(() => {
          navigate("/freelancer/proposals");
        }, 2000);
      }
    }
  };

  if (jobLoading || checkingApplied) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 lg:pt-28 pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-3/4"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
            <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (jobError) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 lg:pt-28 pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
            <p className="text-red-800 dark:text-red-200">{jobError?.message || jobError || "Failed to load job"}</p>
            <Button onClick={() => navigate(-1)} className="mt-4">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Check if user has already applied
  if (hasApplied) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 lg:pt-28 pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="mb-6 text-gray-700 dark:text-gray-300 hover:text-brand dark:hover:text-brand-light hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Already Applied
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You have already submitted a proposal for this job. You can view or edit your proposal from your proposals page.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => navigate('/freelancer/proposals')}
                className="bg-brand hover:bg-brand-dark text-white"
              >
                View My Proposals
              </Button>
              <Button
                onClick={() => navigate('/jobs')}
                variant="outline"
                className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
              >
                Browse More Jobs
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 lg:pt-28 pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="mb-6 text-gray-700 dark:text-gray-300 hover:text-brand dark:hover:text-brand-light hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-brand/10 dark:bg-brand-light/10 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-brand dark:text-brand-light" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                Submit Proposal
              </h1>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Craft a winning proposal for this opportunity
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-green-900 dark:text-green-200 font-semibold">
                  Proposal Submitted Successfully!
                </p>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  Redirecting to My Proposals...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Job Summary Card */}
        {job && (
          <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-brand/10 to-brand-dark/10 dark:from-brand-light/10 dark:to-brand/10 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-5 h-5 text-brand dark:text-brand-light" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Job Opportunity</h2>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {job.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed line-clamp-3">
                {job.description}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="w-10 h-10 bg-brand/10 dark:bg-brand-light/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-brand dark:text-brand-light" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Budget</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {job.budgetType === 'fixed' && job.budgetAmount
                        ? `PKR ${job.budgetAmount.toLocaleString()} (Fixed)`
                        : job.budgetType === 'hourly' && job.hourlyRateMin && job.hourlyRateMax
                        ? `PKR ${job.hourlyRateMin}-${job.hourlyRateMax}/hr`
                        : "Not specified"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="w-10 h-10 bg-brand/10 dark:bg-brand-light/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-brand dark:text-brand-light" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Posted</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {formatDate(job.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
              
              {job.skills && job.skills.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Required Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-brand/10 dark:bg-brand-light/10 text-brand dark:text-brand-light text-sm font-medium rounded-lg border border-brand/20 dark:border-brand-light/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Proposal Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-brand/10 to-brand-dark/10 dark:from-brand-light/10 dark:to-brand/10 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand dark:text-brand-light" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Proposal Details</h3>
            </div>
          </div>
          
          <div className="p-6">
            <ProposalForm job={job} onSubmit={handleSubmit} loading={submitting} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitProposal;
