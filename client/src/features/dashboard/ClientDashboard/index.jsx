import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase,
  DollarSign,
  Users,
  PlusCircle,
  Search,
  CreditCard,
  FileText,
  Sparkles,
  TrendingUp,
  Clock,
  Star,
  Award,
  Eye,
  ArrowRight,
} from 'lucide-react';
import StatCard from '../shared/StatCard';
import ActionButton from '../shared/ActionButton';
import EmptyState from '../shared/EmptyState';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { formatCurrency, getImageUrl, getInitials } from '@/utils/formatters';
import { useAllClientProposals, useJobStats, useRecommendedFreelancers, useMyJobs } from '@/hooks/api';
import { useContracts, useContractStats } from '@/hooks/api/useContracts';
import { formatDistanceToNow } from 'date-fns';
import { useMemo, useState } from 'react';

// Avatar component with fallback
const FreelancerAvatar = ({ freelancer, size = 'md' }) => {
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    sm: 'w-12 h-12 text-xs',
    md: 'w-14 h-14 text-sm',
    lg: 'w-16 h-16 text-lg',
  };
  
  const imageUrl = freelancer?.profilePicture || freelancer?.avatar;
  const name = freelancer?.name || 'Freelancer';
  
  if (!imageUrl || imageError) {
    return (
      <div className={`${sizeClasses[size]} rounded-full border-2 border-brand/30 bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white font-bold`}>
        {getInitials(name)}
      </div>
    );
  }
  
  return (
    <img
      src={getImageUrl(imageUrl)}
      alt={name}
      className={`${sizeClasses[size]} rounded-full border-2 border-brand/30 group-hover:border-brand transition-colors object-cover`}
      onError={() => setImageError(true)}
    />
  );
};

export default function ClientDashboard({ user }) {
  const navigate = useNavigate();

  // Fetch real proposals data
  const { data: proposalsData, isLoading: proposalsLoading, error: proposalsError } = useAllClientProposals();

  // Fetch real stats data
  const { data: jobStatsData, isLoading: jobStatsLoading } = useJobStats();
  const { data: contractStatsData, isLoading: contractStatsLoading } = useContractStats();
  const { data: contractsData, isLoading: contractsLoading } = useContracts({ status: 'active', limit: 10 });
  const { data: myJobsData, isLoading: myJobsLoading } = useMyJobs({ status: 'open', limit: 10 });

  // Get recent proposals (only 4) - handle different response structures
  const allProposals = proposalsData?.data?.proposals || proposalsData?.proposals || [];
  const recentProposals = allProposals.slice(0, 4);

  // Calculate real stats from API data
  const stats = useMemo(() => {
    const contractStats = contractStatsData?.data?.stats || contractStatsData?.stats || {};
    const jobStats = jobStatsData?.data?.stats || jobStatsData?.stats || {};
    
    // Active projects from contracts
    const activeProjects = contractStats.active || 0;
    
    // Total spent from contract stats (completed contracts)
    const totalSpent = contractStats.totalSpent || 0;
    
    // Open jobs count
    const openJobs = myJobsData?.data?.jobs?.length || myJobsData?.data?.length || 0;
    
    return {
      activeProjects,
      totalSpent,
      openJobs,
    };
  }, [contractStatsData, jobStatsData, myJobsData]);

  // Get open jobs for AI recommendations
  const openJobs = myJobsData?.data?.jobs || myJobsData?.data || [];
  const firstOpenJob = openJobs.length > 0 ? openJobs[0] : null;

  // AI recommended freelancers — disabled on load, user triggers via button
  const { data: recommendedFreelancersData, isLoading: aiLoading, refetch: fetchRecommended } = useRecommendedFreelancers(
    firstOpenJob?._id || firstOpenJob?.id,
    {
      limit: 3,
      minScore: 30,
      enabled: false,  // never auto-fire
    }
  );

  // Extract recommended freelancers
  const topFreelancers = useMemo(() => {
    const freelancers = recommendedFreelancersData?.data?.freelancers || recommendedFreelancersData?.freelancers || [];
    return freelancers.slice(0, 3).map((freelancer) => ({
      id: freelancer._id || freelancer.id,
      name: freelancer.name || 'Unknown',
      profilePicture: freelancer.profilePicture || freelancer.avatar,
      avatar: freelancer.profilePicture || freelancer.avatar,
      role: freelancer.skills?.[0] || 'Freelancer',
      rating: freelancer.rating || freelancer.profile?.rating || 0,
      skills: freelancer.skills || [],
      hourlyRate: freelancer.hourlyRate || 0,
      matchScore: freelancer.matchScore || 0,
    }));
  }, [recommendedFreelancersData]);

  const quickActions = [
    {
      title: 'Post a Job',
      description: 'Find the perfect freelancer',
      icon: PlusCircle,
      action: () => navigate('/jobs/create'),
      gradient: 'from-brand to-brand-dark',
    },
    {
      title: 'My Jobs',
      description: 'Manage your posted jobs',
      icon: Briefcase,
      action: () => navigate('/jobs/my-jobs'),
      gradient: 'from-brand-dark to-brand-deeper',
    },
    {
      title: 'My Contracts',
      description: 'View and manage contracts',
      icon: CreditCard,
      action: () => navigate('/contracts'),
      gradient: 'from-green-500 to-green-600',
    },
  ];

  return (
    <div className="min-h-screen pt-0 md:pt-24 lg:pt-28 pb-24 md:pb-8 bg-gradient-to-br from-gray-50 via-brand-light/10 to-white dark:from-gray-900 dark:via-brand-deepest dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-brand-deepest dark:text-white mb-2">
            Welcome back, {user?.name?.split(' ')[0] || 'Client'}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your projects and find top talent
          </p>
        </motion.div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Active Projects"
            value={jobStatsLoading || contractStatsLoading ? '...' : stats.activeProjects}
            subtitle="Currently in progress"
            icon={Briefcase}
            iconBg="bg-gradient-to-br from-brand to-brand-dark"
          />
          <StatCard
            title="Total Spent"
            value={contractStatsLoading ? '...' : formatCurrency(stats.totalSpent, 'USD')}
            subtitle="All time"
            icon={DollarSign}
            iconBg="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatCard
            title="Open Jobs"
            value={myJobsLoading ? '...' : stats.openJobs}
            subtitle="Accepting proposals"
            icon={Users}
            iconBg="bg-gradient-to-br from-purple-500 to-purple-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-brand-deepest dark:text-white mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <ActionButton {...action} />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Proposals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-brand-deepest dark:text-white">
                  Recent Proposals
                </h2>
                {recentProposals.length > 0 && (
                  <Button
                    glass
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/jobs/my-jobs')}
                    className="group"
                  >
                    View All
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                )}
              </div>
              {proposalsLoading ? (
                <Card glass className="p-12 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Loading proposals...</p>
                  </div>
                </Card>
              ) : proposalsError ? (
                <Card glass className="p-12">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <p className="text-red-600 dark:text-red-400 font-semibold mb-2">Failed to load proposals</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {proposalsError?.response?.data?.message || proposalsError?.message || 'Unknown error'}
                    </p>
                  </div>
                </Card>
              ) : recentProposals.length > 0 ? (
                <div className="space-y-4">
                  {recentProposals.slice(0, 4).map((proposal, index) => (
                    <motion.div
                      key={proposal._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                    >
                      <Card 
                        glass 
                        className="p-6 card-hover group cursor-pointer"
                        onClick={() => navigate(`/client/proposals/${proposal._id}`)}
                      >
                        <div className="flex items-start gap-4">
                          {/* Freelancer Avatar */}
                          <FreelancerAvatar 
                            freelancer={proposal.freelancerId}
                            size="lg"
                          />

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-lg font-semibold text-brand-deepest dark:text-white">
                                  {proposal.freelancerId?.name || 'Unknown Freelancer'}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {proposal.jobId?.title || 'Job Title'}
                                </p>
                              </div>
                              <Badge 
                                glass 
                                variant={
                                  proposal.status === 'accepted' 
                                    ? 'success' 
                                    : proposal.status === 'rejected' 
                                    ? 'destructive' 
                                    : 'default'
                                }
                              >
                                {proposal.status}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-4 mb-3 text-sm">
                              {proposal.freelancerId?.rating && (
                                <div className="flex items-center gap-1 text-yellow-500">
                                  <Star className="w-4 h-4 fill-current" />
                                  <span className="font-semibold">{proposal.freelancerId.rating}</span>
                                </div>
                              )}
                              {proposal.freelancerId?.completedJobs && (
                                <div className="text-gray-600 dark:text-gray-400">
                                  {proposal.freelancerId.completedJobs} jobs completed
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1 text-brand font-semibold">
                                  <DollarSign className="w-4 h-4" />
                                  <span>${proposal.bidAmount}</span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                  <Clock className="w-4 h-4" />
                                  <span>{proposal.deliveryTime} days</span>
                                </div>
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDistanceToNow(new Date(proposal.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                          </div>

                          {/* View Details Icon */}
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand/10 group-hover:bg-brand group-hover:text-white text-brand transition-colors">
                            <Eye className="w-5 h-5" />
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No proposals yet"
                  message="Post a job to start receiving proposals from freelancers"
                  icon={FileText}
                  actionLabel="Post a Job"
                  onAction={() => navigate('/jobs/create')}
                />
              )}
            </motion.div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* AI Recommendations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card glass className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-brand-deepest dark:text-white">
                    AI Recommendations
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {aiLoading ? 'Finding best matches...' : topFreelancers.length > 0 ? 'Top freelancers matched for your projects' : 'Click below to find matching freelancers for your open job'}
                </p>

                {aiLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : topFreelancers.length > 0 ? (
                  <div className="space-y-4">
                    {topFreelancers.map((freelancer, index) => (
                    <motion.div
                      key={freelancer.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      className="p-4 rounded-lg border border-brand-light/30 hover:border-brand/50 bg-white/50 dark:bg-gray-800/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <FreelancerAvatar
                          freelancer={freelancer}
                          size="sm"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-brand-deepest dark:text-white text-sm">
                            {freelancer.name}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {freelancer.role}
                          </p>
                        </div>
                        <Badge glass variant="secondary" className="text-xs">
                          {freelancer.matchScore}% match
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                          {freelancer.rating}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          • ${freelancer.hourlyRate}/hr
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {freelancer.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-1 text-xs bg-brand/10 text-brand-dark rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 flex flex-col items-center gap-3">
                    <Sparkles className="w-8 h-8 text-brand/40" />
                    <p className="text-sm text-gray-500 text-center">AI will find the best freelancers for your job</p>
                    {firstOpenJob && (
                      <Button
                        type="button"
                        onClick={() => fetchRecommended()}
                        className="bg-gradient-to-r from-brand to-purple-600 text-white text-sm px-4 py-2"
                      >
                        <Sparkles className="w-4 h-4 mr-1.5" />
                        Find Matching Freelancers
                      </Button>
                    )}
                  </div>
                )}

                {topFreelancers.length > 0 && (
                  <Button
                    glass
                    className="w-full mt-4"
                    onClick={() => firstOpenJob ? navigate(`/jobs/${firstOpenJob._id || firstOpenJob.id}/recommended-freelancers`) : navigate('/freelancers')}
                  >
                    View All Recommendations
                  </Button>
                )}
              </Card>
            </motion.div>

            {/* Budget Tracker */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card glass className="p-6">
                <h3 className="text-lg font-semibold text-brand-deepest dark:text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Spending Overview
                </h3>
                {contractStatsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Total Spent</span>
                        <span className="font-semibold text-brand-deepest dark:text-white">
                          {formatCurrency(stats.totalSpent, 'USD')}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-brand to-brand-dark h-2 rounded-full transition-all duration-500"
                          style={{ width: stats.totalSpent > 0 ? '100%' : '0%' }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {stats.activeProjects} active project{stats.activeProjects !== 1 ? 's' : ''}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Active Contracts</span>
                        <Award className="w-4 h-4 text-brand" />
                      </div>
                      <p className="text-sm font-semibold text-brand-deepest dark:text-white">
                        {stats.activeProjects} project{stats.activeProjects !== 1 ? 's' : ''} in progress
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {stats.openJobs} job{stats.openJobs !== 1 ? 's' : ''} open for proposals
                      </p>
                    </div>

                    <Button
                      glass
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => navigate('/contracts')}
                    >
                      View All Contracts
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
