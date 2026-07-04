

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Clock, DollarSign, Briefcase, 
  Calendar, Eye, FileText, Download, Share2, Bookmark, ChevronDown, ChevronUp, CheckCircle
} from 'lucide-react';
import { useJobDetails } from '../hooks';
import { useCheckIfApplied, useRecommendedFreelancers } from '@/hooks/api';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { useSelector } from 'react-redux';
import { formatDistanceToNow, format } from 'date-fns';
import { formatCurrency } from '@/utils/formatters';
import { JobProposalsList } from '../../proposals/components/JobProposalsList';
import RecommendedFreelancers from '../components/RecommendedFreelancers';
import chatService from '@/services/chatService';

// Helper function to format proposal count in ranges
const formatProposalCount = (count) => {
  if (count === 0) return '0';
  if (count < 5) return 'Less than 5';
  if (count < 10) return '5 to 10';
  if (count < 15) return '10 to 15';
  if (count < 20) return '15 to 20';
  if (count < 50) return '20 to 50';
  return '50+';
};

export const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { data, isLoading, isError } = useJobDetails(id);
  const job = data?.data?.job;
  
  // Only check if applied for freelancers
  const isFreelancer = user?.role === 'freelancer';
  const isClient = user?.role === 'client';
  const { data: applicationStatus, isLoading: checkingApplied } = useCheckIfApplied(id, { 
    enabled: isFreelancer 
  });
  
  // Owner check (compute early so hooks can use it)
  let jobClientId;
  if (job?.client) {
    if (typeof job.client === 'object') {
      jobClientId = (job.client._id || job.client.id)?.toString();
    } else {
      jobClientId = job.client.toString();
    }
  }

  const currentUserId = (user?.id || user?._id)?.toString();
  const isOwner = user?.role === 'client' && currentUserId && jobClientId && currentUserId === jobClientId;

  // Fetch recommended freelancers for clients (controlled — fetch on demand)
  const {
    data: recommendedFreelancersData,
    isLoading: loadingFreelancers,
    refetch: refetchRecommendedFreelancers,
    isRefetching: isRefetchingFreelancers,
  } = useRecommendedFreelancers(id, {
    enabled: false,
    limit: 3, // Only show 3 freelancers on job details page
    minScore: 0,
  });
  
  // Extract freelancers from response - handle different response structures
  const recommendedFreelancers = useMemo(() => {
    if (!recommendedFreelancersData) return [];
    const data = recommendedFreelancersData?.data || recommendedFreelancersData;
    return Array.isArray(data?.freelancers) ? data.freelancers : (Array.isArray(data) ? data : []);
  }, [recommendedFreelancersData]);
  
  // Handle refresh with proper error handling and feedback
  const handleRefreshRecommendations = async () => {
    try {
      await refetchRecommendedFreelancers();
    } catch (error) {
      console.error('Failed to refresh recommendations:', error);
    }
  };
  
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Subscribe to job-specific socket room for real-time updates
  useEffect(() => {
    if (id && chatService.socket) {
      // Subscribe to this job's room
      chatService.socket.emit('subscribe:job', id);
      
      // Cleanup: unsubscribe when component unmounts
      return () => {
        chatService.socket.emit('unsubscribe:job', id);
      };
    }
  }, [id]);
  const hasApplied = applicationStatus?.hasApplied;
  const proposalId = applicationStatus?.proposal?.id;
  const proposalStatus = applicationStatus?.proposal?.status;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 pt-24 lg:pt-28">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 pt-24 lg:pt-28">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Job not found</h2>
          <Button onClick={() => navigate('/jobs')} className="bg-brand hover:bg-brand-dark text-white">
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  const isFixed = job.budgetType === 'fixed';
  const budgetDisplay = isFixed 
    ? `${formatCurrency(job.budgetAmount, 'PKR')} Fixed`
    : `${formatCurrency(job.hourlyRate?.min, 'PKR')}-${formatCurrency(job.hourlyRate?.max, 'PKR')}/hr`;

  
  const canApply = user?.role === 'freelancer' && job.status === 'open';

  // Check if description is long (more than 500 characters)
  const isLongDescription = job.description?.length > 500;
  const displayDescription = showFullDescription || !isLongDescription 
    ? job.description 
    : `${job.description?.slice(0, 500)}...`;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 lg:pt-28 pb-24 md:pb-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-700 dark:text-gray-300 hover:text-brand dark:hover:text-brand-light hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Job Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg overflow-hidden"
            >
              <div className="flex items-start justify-between mb-4 gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {job.isFeatured && (
                      <Badge className="bg-gradient-to-r from-brand to-brand-dark text-white">Featured</Badge>
                    )}
                    <Badge variant="outline" className="border-brand text-brand dark:border-brand-light dark:text-brand-light capitalize">{job.status}</Badge>
                  </div>
                  
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 break-words">
                    {job.title}
                  </h1>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{job.views} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>{formatProposalCount(job.proposalsCount || 0)} proposals</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <Button variant="outline" size="sm" className="border-brand text-brand hover:bg-brand/10 dark:border-brand-light dark:text-brand-light dark:hover:bg-brand-light/10">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-brand text-brand hover:bg-brand/10 dark:border-brand-light dark:text-brand-light dark:hover:bg-brand-light/10">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Description with See More */}
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words overflow-wrap-anywhere">
                  {displayDescription}
                </p>
                {isLongDescription && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="mt-3 flex items-center gap-1 text-brand hover:text-brand-dark dark:text-brand-light dark:hover:text-brand font-medium transition-colors"
                  >
                    {showFullDescription ? (
                      <>
                        See Less <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        See More <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>

            {/* Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Job Details</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-brand" />
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Budget</span>
                  </div>
                  <p className="text-gray-900 dark:text-white font-medium">{budgetDisplay}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-brand" />
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Duration</span>
                  </div>
                  <p className="text-gray-900 dark:text-white capitalize">{job.duration}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="w-5 h-5 text-brand" />
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Experience</span>
                  </div>
                  <p className="text-gray-900 dark:text-white capitalize">{job.experienceLevel}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-brand" />
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Location</span>
                  </div>
                  <p className="text-gray-900 dark:text-white capitalize">
                    {job.locationType}
                    {(job.locationType === 'onsite' || job.locationType === 'hybrid') && 
                     job.location?.city && job.location?.country && (
                      <span className="block text-sm text-gray-600 dark:text-gray-400 mt-1 normal-case">
                        {job.location.city}, {job.location.country}
                      </span>
                    )}
                  </p>
                </div>

                {job.applicationDeadline && (
                  <div className="col-span-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-brand" />
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Application Deadline</span>
                    </div>
                    <p className="text-gray-900 dark:text-white">
                      {format(new Date(job.applicationDeadline), 'MMM dd, yyyy')}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Skills Required */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Skills Required</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills?.map((skill, index) => (
                  <Badge key={index} className="bg-brand/10 text-brand border-brand/20 dark:bg-brand-light/10 dark:text-brand-light dark:border-brand-light/20">
                    {skill}
                  </Badge>
                ))}
              </div>
            </motion.div>

            {/* Requirements */}
            {job.requirements?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Requirements</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Recommended Freelancers - Client View Only (fetch on demand) */}
            {isOwner && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg"
              >
                <RecommendedFreelancers
                  freelancers={recommendedFreelancers}
                  isLoading={loadingFreelancers}
                  jobId={id}
                  onViewAll={() => navigate(`/jobs/${id}/recommended-freelancers`)}
                  compact={true}
                  maxItems={3}
                />
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    size="sm"
                    onClick={handleRefreshRecommendations}
                    disabled={loadingFreelancers || isRefetchingFreelancers}
                    className="flex-1 bg-gradient-to-r from-brand to-brand-dark text-white hover:from-brand-dark hover:to-brand-deeper disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingFreelancers || isRefetchingFreelancers ? 'Finding...' : 'Refresh Recommendations'}
                  </Button>
                  {recommendedFreelancers.length > 0 && (
                    <Button
                      size="sm"
                      onClick={() => navigate(`/jobs/${id}/recommended-freelancers`)}
                      variant="outline"
                      className="flex-1 border-brand text-brand hover:bg-brand/10 dark:border-brand-light dark:text-brand-light"
                    >
                      View All Recommendations
                    </Button>
                  )}
                </div>
              </motion.div>
            )}

            {/* Proposals List - Client View Only */}
            {isOwner && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <JobProposalsList jobId={id} />
              </motion.div>
            )}
            
            {/* Debug: Force show proposals for testing */}
            {user?.role === 'client' && !isOwner && (
              <div className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
                  <strong>Debug Info:</strong> You are a client but not detected as owner of this job.
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-2">
                  User ID: {user?.id} | Job Client ID: {jobClientId}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    navigate(`/jobs/${id}?debug=true`);
                  }}
                  className="text-xs"
                >
                  Force Show Proposals (Debug)
                </Button>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            {canApply && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg sticky top-28"
              >
                {checkingApplied ? (
                  <div className="text-center py-4">
                    <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </div>
                ) : hasApplied && proposalId && proposalStatus !== 'withdrawn' ? (
                  <>
                    <div className="flex items-center justify-center gap-2 mb-4 text-green-600 dark:text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">Already Applied</span>
                    </div>
                    <Button 
                      onClick={() => navigate(`/freelancer/proposals/${proposalId}`)}
                      variant="outline"
                      className="w-full border-brand text-brand hover:bg-brand/10 dark:border-brand-light dark:text-brand-light dark:hover:bg-brand-light/10"
                      size="lg"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Proposal
                    </Button>
                    <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-3">
                      You've already submitted a proposal for this job
                    </p>
                  </>
                ) : (
                  <>
                    <Button 
                      onClick={() => navigate(`/freelancer/proposals/submit/${id}`)}
                      className="w-full bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand-deeper text-white mb-4"
                      size="lg"
                    >
                      Apply Now
                    </Button>
                    <p className="text-xs text-center text-gray-600 dark:text-gray-400">
                      Send your proposal to the client
                    </p>
                  </>
                )}
              </motion.div>
            )}

            {/* Owner Actions */}
            {isOwner && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg sticky top-28"
              >
                <Button 
                  onClick={() => {
                    const jobId = job.id || job._id;
                    navigate(`/jobs/${jobId}/edit`);
                  }}
                  className="w-full bg-brand hover:bg-brand-dark text-white mb-3"
                >
                  Edit Job
                </Button>
                <Button 
                  variant="outline"
                  className="w-full border-red-500 text-red-500 hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-950/20"
                >
                  Delete Job
                </Button>
              </motion.div>
            )}

            {/* Client Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg overflow-hidden"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">About Client</h3>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-light to-brand flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                  {job.client?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">
                    {job.client?.companyName || job.client?.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {job.location?.country && job.location?.city 
                      ? `${job.location.city}, ${job.location.country}`
                      : job.locationType === 'remote' 
                        ? 'Remote' 
                        : job.locationType === 'hybrid'
                          ? 'Hybrid'
                          : 'Onsite'}
                  </p>
                </div>
              </div>

              <Button variant="outline" className="w-full border-brand text-brand hover:bg-brand/10 dark:border-brand-light dark:text-brand-light dark:hover:bg-brand-light/10">
                View Profile
              </Button>
            </motion.div>

            {/* Category Badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Category</h3>
              <Badge className="bg-brand/10 text-brand border-brand/20 dark:bg-brand-light/10 dark:text-brand-light dark:border-brand-light/20 text-base">
                {job.category}
              </Badge>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
