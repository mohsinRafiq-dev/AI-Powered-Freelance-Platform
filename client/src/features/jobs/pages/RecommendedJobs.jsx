import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Target, Search, TrendingUp, Star, Zap, RefreshCw } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useRecommendedJobs } from '@/hooks/api/useJobs';
import { useAIFeatureStatus } from '@/hooks/api/useAdminSettings';
import { JobCard } from '../components';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import EmptyState from '../../dashboard/shared/EmptyState';
import { InlineLoader } from '../../../components/common/Loader';
import LazyLoadItem from '../../../components/common/LazyLoadItem';
import MatchScoreBadge from '../components/MatchScoreBadge';

export const RecommendedJobs = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const userSkills = user?.skills || [];

  // Check AI feature status
  const { data: aiStatus } = useAIFeatureStatus();
  const aiEnabled = aiStatus?.data?.aiEnabled && aiStatus?.data?.features?.jobRecommendations;

  // Fetch AI-recommended jobs
  const { data, isLoading, isError, refetch } = useRecommendedJobs({
    enabled: userSkills.length > 0,
    showErrorToast: true,
  });

  // Extract jobs from response
  const jobs = data?.data?.jobs || [];

  if (userSkills.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 lg:pt-28 pb-24 md:pb-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full mb-6 shadow-lg">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Complete Your Profile
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Add your skills to your profile to get personalized job recommendations based on your expertise
            </p>
            <Button
              onClick={() => navigate('/settings')}
              className="bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand-deepest text-white shadow-lg"
            >
              Complete Profile
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 lg:pt-28 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-brand/10 via-brand-light/10 to-brand-dark/10 dark:from-brand-dark/20 dark:via-brand/20 dark:to-brand-dark/20 border-2 border-brand/20 dark:border-brand/30 rounded-2xl p-8 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand to-brand-dark rounded-xl flex items-center justify-center shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                      Recommended Jobs
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                      <Zap className="w-4 h-4 text-brand" />
                      Personalized matches based on your skills
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We've found the perfect opportunities that match your expertise. Apply now to boost your chances!
                </p>

                {/* Your Skills */}
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500" />
                    Your Skills ({userSkills.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {userSkills.slice(0, 8).map((skill, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Badge className="bg-brand hover:bg-brand-dark text-white border-none shadow-sm">
                          {skill}
                        </Badge>
                      </motion.div>
                    ))}
                    {userSkills.length > 8 && (
                      <Badge variant="outline" className="border-brand text-brand dark:border-brand-light dark:text-brand-light">
                        +{userSkills.length - 8} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* AI Status Indicator */}
                {aiEnabled && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-brand dark:text-brand-light">
                    <Sparkles className="w-4 h-4" />
                    <span>AI-Enhanced recommendations active</span>
                  </div>
                )}
              </div>

              {/* Stats Card */}
              {!isLoading && jobs.length > 0 && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-brand/20 dark:border-brand/30 min-w-[200px]"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                      {jobs.length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      Perfect Matches
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <InlineLoader size="large" text="Finding Perfect Matches" />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 border-2 border-red-200 dark:border-red-800 rounded-xl p-8 text-center shadow-lg"
          >
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Failed to load recommendations. Please try again.
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-brand hover:bg-brand-dark text-white"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && jobs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-12 text-center shadow-lg"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Search className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              No Matching Jobs Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              We couldn't find jobs that match your skills right now. Try browsing all available opportunities or update your skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/jobs')}
                className="bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand-deepest text-white"
              >
                <Search className="w-4 h-4 mr-2" />
                Browse All Jobs
              </Button>
              <Button
                onClick={() => navigate('/settings')}
                variant="outline"
                className="border-2 border-brand text-brand hover:bg-brand/10 dark:border-brand-light dark:text-brand-light"
              >
                Update Skills
              </Button>
            </div>
          </motion.div>
        )}

        {/* Recommended Jobs Grid */}
        {!isLoading && !isError && jobs.length > 0 && (
          <>
            {/* Stats & Filter Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
            >
              <div>
                <p className="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
                  <span className="text-3xl font-bold bg-gradient-to-r from-brand to-brand-dark bg-clip-text text-transparent">
                    {jobs.length}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {jobs.length === 1 ? 'Perfect Match' : 'Perfect Matches'} Found
                  </span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Sorted by match score • Best matches first
                  {aiEnabled && (
                    <span className="ml-2 text-brand dark:text-brand-light">
                      <Sparkles className="w-3 h-3 inline mr-1" />
                      AI-Enhanced
                    </span>
                  )}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => refetch()}
                  variant="outline"
                  size="sm"
                  className="border-brand text-brand hover:bg-brand/10 dark:border-brand-light dark:text-brand-light dark:hover:bg-brand-light/10"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Link to="/jobs">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-2 border-brand text-brand hover:bg-brand/10 dark:border-brand-light dark:text-brand-light dark:hover:bg-brand-light/10 shadow-sm"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Browse All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {jobs.map((job, index) => (
                <LazyLoadItem
                  key={job.id || job._id}
                  threshold={0.1}
                  rootMargin="100px"
                  animateOnLoad={true}
                >
                  <div className="relative">
                    <JobCard 
                      job={job} 
                      matchScore={job.matchScore || job.finalScore}
                    />
                    {/* Match Score Badge Overlay */}
                    {(job.matchScore || job.finalScore) && (
                      <div className="absolute top-4 right-4 z-10">
                        <MatchScoreBadge
                          matchScore={job.matchScore || job.finalScore}
                          baseScore={job.baseScore}
                          aiScore={job.aiScore}
                          confidence={job.matchConfidence}
                          aiEnhanced={job.aiEnhanced}
                          size="md"
                        />
                      </div>
                    )}
                  </div>
                </LazyLoadItem>
              ))}
            </div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12 bg-gradient-to-r from-brand/10 via-brand-light/10 to-brand-dark/10 dark:from-brand-dark/20 dark:via-brand/20 dark:to-brand-dark/20 border-2 border-brand/20 dark:border-brand/30 rounded-2xl p-8 lg:p-12 text-center shadow-xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand to-brand-dark rounded-full mb-6 shadow-lg"
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Want More Opportunities?
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Explore all available jobs across different categories and find your next exciting project. 
                New opportunities are added daily!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/jobs">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand-deepest text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Browse All Jobs
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                
                <Link to="/settings">
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-2 border-brand text-brand hover:bg-brand/10 dark:border-brand-light dark:text-brand-light dark:hover:bg-brand-light/10"
                  >
                    <Star className="w-5 h-5 mr-2" />
                    Update Skills
                  </Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};
