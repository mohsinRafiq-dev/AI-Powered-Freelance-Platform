import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useRecommendedFreelancers } from '@/hooks/api';
import RecommendedFreelancersComponent from '../components/RecommendedFreelancers';
import { InlineLoader } from '../../../components/common/Loader';
import EmptyState from '../../dashboard/shared/EmptyState';
import { Users } from 'lucide-react';

/**
 * Recommended Freelancers Page
 * Full page view of recommended freelancers for a job
 */
export const RecommendedFreelancersPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useRecommendedFreelancers(jobId, {
    enabled: !!jobId,
    limit: 50,
    minScore: 0,
  });

  const freelancers = data?.data?.freelancers || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 lg:pt-28 pb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <InlineLoader message="Finding perfect freelancers..." />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 lg:pt-28 pb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <EmptyState
            title="Failed to load recommendations"
            message="We couldn't load freelancer recommendations. Please try again."
            icon={Users}
            actionLabel="Go Back"
            onAction={() => navigate(-1)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 lg:pt-28 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-4 border-brand text-brand hover:bg-brand/10 dark:border-brand-light dark:text-brand-light"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Job
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-brand to-brand-dark rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Recommended Freelancers
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                AI-powered matches for this job
              </p>
            </div>
          </div>
        </div>

        {/* Recommended Freelancers Component */}
        <RecommendedFreelancersComponent
          freelancers={freelancers}
          isLoading={false}
          jobId={jobId}
        />
      </div>
    </div>
  );
};

export default RecommendedFreelancersPage;





