import { useState, useCallback } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-grid-layout/css/resizable.css';
import { 
  DollarSign, 
  Users, 
  Briefcase, 
  TrendingUp, 
  Calendar,
  Lock,
  Unlock,
  AlertCircle,
  RefreshCw,
  Download,
  FileText
} from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { 
  useDashboardMetrics,
  useUserGrowthReport,
  useRevenueReport,
  useCategoryDistribution 
} from '../../../hooks/admin/useAnalytics';
import { exportToPDF, exportToExcel, exportToCSV } from '../../../api/admin/analyticsApi';
import toast from 'react-hot-toast';
import UserGrowthChart from './UserGrowthChart';
import RevenueChart from './RevenueChart';
import CategoryPieChart from './CategoryPieChart';
import TopPerformersTable from './TopPerformersTable';
import { formatCurrency } from '../../../utils/formatters';
import { AdminPageHeader, AdminLoading } from '../components';
import { useHasPermission } from '../../../hooks/admin/usePermissions';
import { PERMISSIONS } from '../../../utils/permissions';

const ResponsiveGridLayout = WidthProvider(Responsive);

const Analytics = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [isExporting, setIsExporting] = useState(false);
  const [isLocked, setIsLocked] = useState(true);

  // Permission check
  const canExportAnalytics = useHasPermission(PERMISSIONS.EXPORT_ANALYTICS);
  const [layouts, setLayouts] = useState({
    lg: [
      { i: 'revenue', x: 0, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
      { i: 'platformFees', x: 3, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
      { i: 'activeUsers', x: 6, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
      { i: 'jobsPosted', x: 9, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
      { i: 'userGrowth', x: 0, y: 2, w: 6, h: 4, minW: 4, minH: 3 },
      { i: 'revenue Chart', x: 6, y: 2, w: 6, h: 4, minW: 4, minH: 3 },
      { i: 'jobStats', x: 0, y: 6, w: 4, h: 3, minW: 3, minH: 2 },
      { i: 'userActivity', x: 4, y: 6, w: 4, h: 3, minW: 3, minH: 2 },
      { i: 'verification', x: 8, y: 6, w: 4, h: 3, minW: 3, minH: 2 },
      { i: 'categories', x: 0, y: 9, w: 6, h: 4, minW: 4, minH: 3 },
      { i: 'flagged', x: 6, y: 9, w: 6, h: 4, minW: 4, minH: 3 },
      { i: 'topFreelancers', x: 0, y: 13, w: 6, h: 4, minW: 4, minH: 3 },
      { i: 'topClients', x: 6, y: 13, w: 6, h: 4, minW: 4, minH: 3 },
    ]
  });

  const { data: metrics, isLoading, refetch, error } = useDashboardMetrics();
  const { data: userGrowth } = useUserGrowthReport(dateRange.startDate, dateRange.endDate, 'day');
  const { data: revenue } = useRevenueReport(dateRange.startDate, dateRange.endDate);
  const { data: categories } = useCategoryDistribution();

  const onLayoutChange = useCallback((layout, layouts) => {
    setLayouts(layouts);
    // Save to localStorage
    localStorage.setItem('analyticsLayout', JSON.stringify(layouts));
  }, []);

  const handleExport = async (format) => {
    setIsExporting(true);
    try {
      let blob;
      let filename;

      if (format === 'pdf') {
        blob = await exportToPDF(dateRange.startDate, dateRange.endDate);
        filename = `analytics-${Date.now()}.pdf`;
      } else if (format === 'excel') {
        blob = await exportToExcel(dateRange.startDate, dateRange.endDate);
        filename = `analytics-${Date.now()}.xlsx`;
      } else {
        blob = await exportToCSV(dateRange.startDate, dateRange.endDate);
        filename = `analytics-${Date.now()}.csv`;
      }

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      
      toast.success(`Report exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export report');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDateChange = (field, value) => {
    setDateRange(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <AdminPageHeader 
          title="Analytics Dashboard"
          description="Real-time platform insights and performance metrics"
        />
        <AdminLoading message="Loading analytics data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <AdminPageHeader 
          title="Analytics Dashboard"
          description="Real-time platform insights and performance metrics"
        />
        <div className="flex justify-center items-center h-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center max-w-md p-8">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Failed to Load Analytics</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error?.message || 'Unable to fetch analytics data from the server'}
            </p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  const data = metrics?.data || {};

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Analytics Dashboard"
        description="Real-time platform insights and performance metrics"
      >
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsLocked(!isLocked)}
            className="flex items-center gap-2"
          >
            {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            {isLocked ? 'Unlock Layout' : 'Lock Layout'}
          </Button>
          
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          
          {canExportAnalytics && (
            <div className="relative group">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <button
                  onClick={() => handleExport('pdf')}
                  disabled={isExporting}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-t-lg disabled:opacity-50 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  PDF
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  disabled={isExporting}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Excel
                </button>
                <button
                  onClick={() => handleExport('csv')}
                  disabled={isExporting}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-b-lg disabled:opacity-50 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  CSV
                </button>
              </div>
            </div>
          )}
        </div>
      </AdminPageHeader>

      {/* Date Range Filter */}
      <Card glass className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand dark:text-brand-light" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Date Range:</span>
          </div>
          <input
            type="date"
            value={dateRange.startDate}
            max={dateRange.endDate || new Date().toISOString().split('T')[0]}
            onChange={(e) => handleDateChange('startDate', e.target.value)}
            className="px-3 py-2 border border-brand-light/50 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <span className="text-gray-600 dark:text-gray-400">to</span>
          <input
            type="date"
            value={dateRange.endDate}
            min={dateRange.startDate}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => handleDateChange('endDate', e.target.value)}
            className="px-3 py-2 border border-brand-light/50 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card glass className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-brand-deepest dark:text-white mt-1">
                  Rs. {formatCurrency(data.totalRevenue?.total || 0)}
                </p>
                <p className="text-xs text-brand mt-1">
                  {data.totalRevenue?.count || 0} completed jobs
                </p>
              </div>
              <div className="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-brand" />
              </div>
            </div>
          </Card>

          <Card glass className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Platform Fees</p>
                <p className="text-2xl font-bold text-brand-deepest dark:text-white mt-1">
                  Rs. {formatCurrency(data.platformFees?.total || 0)}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  10% of total revenue
                </p>
              </div>
              <div className="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-brand" />
              </div>
            </div>
          </Card>

          <Card glass className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
                <p className="text-2xl font-bold text-brand-deepest dark:text-white mt-1">
                  {data.activeUsers?.total || 0}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {data.activeUsers?.daily || 0} today
                </p>
              </div>
              <div className="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-brand" />
              </div>
            </div>
          </Card>

          <Card glass className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Jobs Posted</p>
                <p className="text-2xl font-bold text-brand-deepest dark:text-white mt-1">
                  {data.jobStats?.posted || 0}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {data.jobStats?.completionRate || 0}% completion rate
                </p>
              </div>
              <div className="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-brand" />
              </div>
            </div>
          </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card glass className="p-6">
          <h3 className="text-lg font-semibold text-brand-deepest dark:text-white mb-4">
            Job Statistics
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
              <Badge variant="success">{data.jobStats?.completed || 0}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">In Progress</span>
              <Badge variant="default" className="bg-brand/10 text-brand border-brand/20">{data.jobStats?.inProgress || 0}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Cancelled</span>
              <Badge variant="red">{data.jobStats?.cancelled || 0}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Avg Value</span>
              <span className="text-sm font-medium text-brand-deepest dark:text-white">
                Rs. {formatCurrency(data.jobStats?.avgValue || 0)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-brand-deepest dark:text-white mb-4">
            User Activity
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Daily Active</span>
              <Badge variant="green">{data.activeUsers?.daily || 0}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Weekly Active</span>
              <Badge variant="default" className="bg-brand/10 text-brand border-brand/20">{data.activeUsers?.weekly || 0}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Monthly Active</span>
              <Badge variant="default" className="bg-brand/10 text-brand border-brand/20">{data.activeUsers?.monthly || 0}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Users</span>
              <span className="text-sm font-medium text-brand-deepest dark:text-white">
                {data.activeUsers?.total || 0}
              </span>
            </div>
          </div>
        </Card>

        <Card glass className="p-6">
          <h3 className="text-lg font-semibold text-brand-deepest dark:text-white mb-4">
            Verification Status
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Verified</span>
              <Badge variant="success">{data.verificationStats?.verified || 0}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
              <Badge variant="yellow">{data.verificationStats?.pending || 0}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Rejected</span>
              <Badge variant="red">{data.verificationStats?.rejected || 0}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total</span>
              <span className="text-sm font-medium text-brand-deepest dark:text-white">
                {data.verificationStats?.total || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card glass className="p-6">
          <h3 className="text-lg font-semibold text-brand-deepest dark:text-white mb-4">
            User Growth
          </h3>
          <UserGrowthChart data={userGrowth?.data} />
        </Card>

        <Card glass className="p-6">
          <h3 className="text-lg font-semibold text-brand-deepest dark:text-white mb-4">
            Revenue Trend
          </h3>
          <RevenueChart data={revenue?.data} />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card glass className="p-6">
          <h3 className="text-lg font-semibold text-brand-deepest dark:text-white mb-4">
            Job Category Distribution
          </h3>
          <CategoryPieChart data={categories?.data} />
        </Card>

        <Card glass className="p-6">
          <h3 className="text-lg font-semibold text-brand-deepest dark:text-white mb-4">
            Flagged Content
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <span className="text-sm font-medium text-red-800 dark:text-red-300">Manual Flags</span>
              <Badge variant="red" size="lg">{data.flaggedJobsCount?.manual || 0}</Badge>
            </div>
            <div className="flex justify-between items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Auto-detected</span>
              <Badge variant="yellow" size="lg">{data.flaggedJobsCount?.auto || 0}</Badge>
            </div>
            <div className="flex justify-between items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-300">High Severity</span>
              <Badge variant="yellow" size="lg">{data.flaggedJobsCount?.high || 0}</Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card glass className="p-6">
          <h3 className="text-lg font-semibold text-brand-deepest dark:text-white mb-4">
            Top Freelancers
          </h3>
          <TopPerformersTable data={data.topFreelancers || []} type="freelancer" />
        </Card>

        <Card glass className="p-6">
          <h3 className="text-lg font-semibold text-brand-deepest dark:text-white mb-4">
            Top Clients
          </h3>
          <TopPerformersTable data={data.topClients || []} type="client" />
        </Card>
      </div>
    </div>
  );
};

export default Analytics;

