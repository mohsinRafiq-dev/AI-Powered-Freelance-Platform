import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase,
  FileText,
  DollarSign,
  User,
  Search,
  Settings,
  Award,
  Wallet,
  Bell,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import StatCard from '../shared/StatCard';
import ActionButton from '../shared/ActionButton';
import EmptyState from '../shared/EmptyState';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { useProposalStats, useMyProposals } from '@/hooks/api';
import { useContracts, useContractStats } from '@/hooks/api/useContracts';
import { useNotifications } from '@/hooks/api';
import { formatDistanceToNow } from 'date-fns';
import { useMemo } from 'react';

export default function FreelancerDashboard({ user }) {
  const navigate = useNavigate();

  // Fetch real stats data
  const { data: proposalStatsData, isLoading: proposalStatsLoading } = useProposalStats();
  const { data: contractStatsData, isLoading: contractStatsLoading } = useContractStats();
  const { data: contractsData, isLoading: contractsLoading } = useContracts({ status: 'active', limit: 5 });
  const { data: notificationsData, notifications, isLoading: notificationsLoading } = useNotifications({ enabled: true });

  // Calculate real stats from API data
  const stats = useMemo(() => {
    const proposalStats = proposalStatsData?.data || proposalStatsData || {};
    const contractStats = contractStatsData?.data?.stats || contractStatsData?.stats || {};
    
    // Active jobs from active contracts
    const activeJobs = contractStats.active || 0;
    
    // Pending proposals
    const pendingProposals = proposalStats.pending || 0;
    
    // Total earnings from contract stats
    const earnings = contractStats.totalEarned || 0;
    
    return {
      activeJobs,
      pendingProposals,
      earnings,
    };
  }, [proposalStatsData, contractStatsData]);

  // Get active contracts (projects)
  const activeContracts = useMemo(() => {
    const contracts = contractsData?.data || contractsData?.contracts || [];
    return contracts
      .filter(c => c.status === 'active')
      .slice(0, 5)
      .map(contract => ({
        id: contract._id || contract.id,
        title: contract.title || contract.jobId?.title || 'Untitled Project',
        client: contract.clientId?.name || contract.client?.name || 'Unknown Client',
        status: contract.status,
        dueDate: contract.endDate || contract.dueDate,
        amount: contract.totalAmount || contract.amount || 0,
      }));
  }, [contractsData]);

  // Get recent notifications (real-time)
  const recentNotifications = useMemo(() => {
    const notifs = Array.isArray(notifications) ? notifications : [];
    return notifs.slice(0, 5).map(notif => ({
      id: notif._id || notif.id,
      type: notif.type || 'default',
      message: notif.message || notif.title || 'New notification',
      time: notif.createdAt ? formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true }) : 'Just now',
      unread: !notif.isRead,
    }));
  }, [notifications]);

  const quickActions = [
    {
      title: 'Browse Jobs',
      description: 'Find projects matching your skills',
      icon: Search,
      action: () => navigate('/jobs'),
      gradient: 'from-brand to-brand-dark',
    },
    {
      title: 'My Proposals',
      description: 'View and manage your proposals',
      icon: FileText,
      action: () => navigate('/freelancer/proposals'),
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Recommended Jobs',
      description: 'Jobs tailored for you',
      icon: Briefcase,
      action: () => navigate('/jobs/recommended'),
      gradient: 'from-brand-dark to-brand-deeper',
    },
    {
      title: 'Update Profile',
      description: 'Keep your profile current',
      icon: Settings,
      action: () => navigate('/profile'),
      gradient: 'from-brand to-brand-dark',
    },
    {
      title: 'My Contracts',
      description: 'View and manage contracts',
      icon: Wallet,
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
            Welcome back, {user?.name?.split(' ')[0] || 'Freelancer'}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your freelance work today
          </p>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Active Jobs"
            value={contractStatsLoading ? '...' : stats.activeJobs}
            subtitle="Currently working on"
            icon={Briefcase}
            iconBg="bg-gradient-to-br from-brand to-brand-dark"
          />
          <StatCard
            title="Pending Proposals"
            value={proposalStatsLoading ? '...' : stats.pendingProposals}
            subtitle="Awaiting response"
            icon={FileText}
            iconBg="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatCard
            title="Total Earnings"
            value={contractStatsLoading ? '...' : formatCurrency(stats.earnings, 'USD')}
            subtitle="All time"
            icon={DollarSign}
            iconBg="bg-gradient-to-br from-green-500 to-green-600"
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* Active Projects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-brand-deepest dark:text-white">
                  Active Projects
                </h2>
                {activeContracts.length > 0 && (
                  <Button
                    glass
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/contracts')}
                    className="group"
                  >
                    View All
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                )}
              </div>
              {contractsLoading ? (
                <Card glass className="p-12 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Loading projects...</p>
                  </div>
                </Card>
              ) : activeContracts.length > 0 ? (
                <div className="space-y-4">
                  {activeContracts.map((contract, index) => (
                    <motion.div
                      key={contract.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                    >
                      <Card 
                        glass 
                        className="p-6 card-hover group cursor-pointer"
                        onClick={() => navigate(`/contracts/${contract.id}`)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-brand-deepest dark:text-white">
                                {contract.title}
                              </h3>
                              <Badge glass variant="default">
                                {contract.status.replace('-', ' ')}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              Client: {contract.client}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              {contract.dueDate && (
                                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                  <Calendar className="w-4 h-4" />
                                  <span>Due: {formatDate(contract.dueDate)}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1 text-brand font-semibold">
                                <DollarSign className="w-4 h-4" />
                                <span>{formatCurrency(contract.amount, 'USD')}</span>
                              </div>
                            </div>
                          </div>
                          <TrendingUp className="w-5 h-5 text-brand group-hover:scale-110 transition-transform" />
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No active projects"
                  message="Start browsing jobs to find your next opportunity"
                  icon={Briefcase}
                  actionLabel="Browse Jobs"
                  onAction={() => navigate('/jobs')}
                />
              )}
            </motion.div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Notifications Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card glass className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-brand-deepest dark:text-white flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notifications
                  </h3>
                  {recentNotifications.filter(n => n.unread).length > 0 && (
                    <Badge glass variant="destructive">
                      {recentNotifications.filter(n => n.unread).length} new
                    </Badge>
                  )}
                </div>
                {notificationsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : recentNotifications.length > 0 ? (
                  <div className="space-y-3">
                    {recentNotifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                        className={`
                          p-3 rounded-lg border transition-all cursor-pointer
                          ${notification.unread
                            ? 'bg-brand/5 border-brand/30 hover:bg-brand/10'
                            : 'bg-gray-50/50 dark:bg-gray-800/30 border-gray-200/30 dark:border-gray-700/30 hover:bg-gray-100/50'
                          }
                        `}
                        onClick={() => navigate('/notifications')}
                      >
                        <p className="text-sm font-medium text-brand-deepest dark:text-white mb-1">
                          {notification.message}
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {notification.time}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No notifications"
                    message="You're all caught up!"
                    icon={Bell}
                    actionLabel="View All"
                    onAction={() => navigate('/notifications')}
                  />
                )}
                {recentNotifications.length > 0 && (
                  <Button
                    glass
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => navigate('/notifications')}
                  >
                    View All Notifications
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </Card>
            </motion.div>

            {/* Earnings Overview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card glass className="p-6">
                <h3 className="text-lg font-semibold text-brand-deepest dark:text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Earnings Overview
                </h3>
                {contractStatsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Total Earnings</span>
                        <span className="font-semibold text-brand-deepest dark:text-white">
                          {formatCurrency(stats.earnings, 'USD')}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: stats.earnings > 0 ? '100%' : '0%' }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {stats.activeJobs} active project{stats.activeJobs !== 1 ? 's' : ''}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Performance</span>
                        <Award className="w-4 h-4 text-brand" />
                      </div>
                      <p className="text-sm font-semibold text-brand-deepest dark:text-white">
                        {stats.pendingProposals} pending proposal{stats.pendingProposals !== 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Keep up the great work!
                      </p>
                    </div>

                    <Button
                      glass
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => navigate('/payments/withdraw')}
                    >
                      <Wallet className="w-4 h-4 mr-2" />
                      Withdraw Earnings
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
