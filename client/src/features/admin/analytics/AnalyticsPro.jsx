import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  DollarSign, 
  Users, 
  Briefcase, 
  TrendingUp, 
  Download,
  Calendar,
  RefreshCw,
  FileText,
  AlertCircle,
  Activity,
  GripVertical,
  Lock,
  Unlock
} from 'lucide-react';
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
import { AdminPageHeader } from '../components';

// Draggable Widget Component
const DraggableWidget = ({ id, children, className, disabled }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`relative group ${className}`}>
      {!disabled && (
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 right-2 z-10 p-2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-sm"
        >
          <GripVertical className="w-4 h-4 text-gray-500" />
        </div>
      )}
      {children}
    </div>
  );
};

const AnalyticsPro = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [isExporting, setIsExporting] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [activeId, setActiveId] = useState(null);

  // Widget orders
  const [metricsOrder, setMetricsOrder] = useState(() => {
    const saved = localStorage.getItem('analyticsMetricsOrder');
    return saved ? JSON.parse(saved) : ['revenue', 'platformFees', 'activeUsers', 'jobsPosted'];
  });

  const [chartsOrder, setChartsOrder] = useState(() => {
    const saved = localStorage.getItem('analyticsChartsOrder');
    return saved ? JSON.parse(saved) : ['userGrowth', 'revenueChart'];
  });

  const [statsOrder, setStatsOrder] = useState(() => {
    const saved = localStorage.getItem('analyticsStatsOrder');
    return saved ? JSON.parse(saved) : ['jobStats', 'userActivity', 'verification'];
  });

  const [categoriesOrder, setCategoriesOrder] = useState(() => {
    const saved = localStorage.getItem('analyticsCategoriesOrder');
    return saved ? JSON.parse(saved) : ['categories', 'flagged'];
  });

  const [performersOrder, setPerformersOrder] = useState(() => {
    const saved = localStorage.getItem('analyticsPerformersOrder');
    return saved ? JSON.parse(saved) : ['topFreelancers', 'topClients'];
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Save orders to localStorage
  useEffect(() => {
    localStorage.setItem('analyticsMetricsOrder', JSON.stringify(metricsOrder));
  }, [metricsOrder]);

  useEffect(() => {
    localStorage.setItem('analyticsChartsOrder', JSON.stringify(chartsOrder));
  }, [chartsOrder]);

  useEffect(() => {
    localStorage.setItem('analyticsStatsOrder', JSON.stringify(statsOrder));
  }, [statsOrder]);

  useEffect(() => {
    localStorage.setItem('analyticsCategoriesOrder', JSON.stringify(categoriesOrder));
  }, [categoriesOrder]);

  useEffect(() => {
    localStorage.setItem('analyticsPerformersOrder', JSON.stringify(performersOrder));
  }, [performersOrder]);

  const { data: metrics, isLoading, refetch, error } = useDashboardMetrics();
  const { data: userGrowth } = useUserGrowthReport(dateRange.startDate, dateRange.endDate, 'day');
  const { data: revenue } = useRevenueReport(dateRange.startDate, dateRange.endDate);
  const { data: categories } = useCategoryDistribution();

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      if (metricsOrder.includes(active.id)) {
        setMetricsOrder((items) => {
          const oldIndex = items.indexOf(active.id);
          const newIndex = items.indexOf(over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      } else if (chartsOrder.includes(active.id)) {
        setChartsOrder((items) => {
          const oldIndex = items.indexOf(active.id);
          const newIndex = items.indexOf(over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      } else if (statsOrder.includes(active.id)) {
        setStatsOrder((items) => {
          const oldIndex = items.indexOf(active.id);
          const newIndex = items.indexOf(over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      } else if (categoriesOrder.includes(active.id)) {
        setCategoriesOrder((items) => {
          const oldIndex = items.indexOf(active.id);
          const newIndex = items.indexOf(over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      } else if (performersOrder.includes(active.id)) {
        setPerformersOrder((items) => {
          const oldIndex = items.indexOf(active.id);
          const newIndex = items.indexOf(over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    }

    setActiveId(null);
  };

  const handleExport = async (format) => {
    setIsExporting(true);
    try {
      let blob, filename;
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
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brand mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Failed to Load Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error?.message || 'Unable to fetch analytics data from the server'}
          </p>
          <Button onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const data = metrics?.data || {};

  // MetricCard Component
  const MetricCard = ({ title, value, subtitle, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">{title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
            {subtitle && <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">{subtitle}</p>}
          </div>
          <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-brand/10">
            <Icon className="w-7 h-7 text-brand" />
          </div>
      </div>
    </div>
  );

  // ChartCard Component
  const ChartCard = ({ title, children }) => (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      {children}
    </div>
  );

  // Render metric card
  const renderMetric = (widgetId) => {
    const configs = {
      revenue: {
        title: 'Total Revenue',
        value: `Rs. ${formatCurrency(data.totalRevenue?.total || 0)}`,
        subtitle: `${data.totalRevenue?.count || 0} completed jobs`,
        icon: DollarSign,
        color: 'text-brand',
      },
      platformFees: {
        title: 'Platform Fees',
        value: `Rs. ${formatCurrency(data.platformFees?.total || 0)}`,
        subtitle: '10% commission',
        icon: TrendingUp,
        color: 'text-brand',
      },
      activeUsers: {
        title: 'Active Users',
        value: data.activeUsers?.total || 0,
        subtitle: `${data.activeUsers?.daily || 0} active today`,
        icon: Users,
        color: 'text-brand',
      },
      jobsPosted: {
        title: 'Jobs Posted',
        value: data.jobStats?.posted || data.jobStats?.total || 0,
        subtitle: `${data.jobStats?.completed || 0} completed`,
        icon: Briefcase,
        color: 'text-brand',
      },
    };

    const config = configs[widgetId];
    return config ? <MetricCard {...config} /> : null;
  };

  // Render chart or stat widget
  const renderWidget = (widgetId) => {
    switch (widgetId) {
      case 'userGrowth':
        return (
          <ChartCard title="User Growth">
            <UserGrowthChart data={userGrowth?.data} />
          </ChartCard>
        );
      case 'revenueChart':
        return (
          <ChartCard title="Revenue Trend">
            <RevenueChart data={revenue?.data} />
          </ChartCard>
        );
      case 'jobStats':
        return (
          <ChartCard title="Job Statistics">
            <div className="space-y-3">
              {[
                { label: 'Completed', value: data.jobStats?.completed || 0, color: 'green' },
                { label: 'In Progress', value: data.jobStats?.inProgress || 0, color: 'blue' },
                { label: 'Cancelled', value: data.jobStats?.cancelled || 0, color: 'red' },
                { label: 'Avg Value', value: `Rs. ${formatCurrency(data.jobStats?.avgValue || 0)}`, color: 'gray' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
                  <Badge variant={color}>{value}</Badge>
                </div>
              ))}
            </div>
          </ChartCard>
        );
      case 'userActivity':
        return (
          <ChartCard title="User Activity">
            <div className="space-y-3">
              {[
                { label: 'Daily Active', value: data.activeUsers?.daily || 0, color: 'green' },
                { label: 'Weekly Active', value: data.activeUsers?.weekly || 0, color: 'blue' },
                { label: 'Monthly Active', value: data.activeUsers?.monthly || 0, color: 'purple' },
                { label: 'Total Users', value: data.activeUsers?.total || 0, color: 'gray' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
                  <Badge variant={color}>{value}</Badge>
                </div>
              ))}
            </div>
          </ChartCard>
        );
      case 'verification':
        return (
          <ChartCard title="Verification Status">
            <div className="space-y-3">
              {[
                { label: 'Verified', value: data.verificationStats?.verified || 0, color: 'green' },
                { label: 'Pending', value: data.verificationStats?.pending || 0, color: 'yellow' },
                { label: 'Rejected', value: data.verificationStats?.rejected || 0, color: 'red' },
                { label: 'Total', value: data.verificationStats?.total || 0, color: 'gray' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
                  <Badge variant={color}>{value}</Badge>
                </div>
              ))}
            </div>
          </ChartCard>
        );
      case 'categories':
        return (
          <ChartCard title="Job Categories">
            <CategoryPieChart data={categories?.data} />
          </ChartCard>
        );
      case 'flagged':
        return (
          <ChartCard title="Flagged Content">
            <div className="space-y-3">
                {[
                  { label: 'Manual Flags', value: data.flaggedJobsCount?.manual || 0, bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-800 dark:text-red-300' },
                  { label: 'Auto-detected', value: data.flaggedJobsCount?.auto || 0, bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-800 dark:text-yellow-300' },
                  { label: 'High Severity', value: data.flaggedJobsCount?.high || 0, bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-800 dark:text-yellow-300' },
                ].map(({ label, value, bg, text }) => (
                <div key={label} className={`flex justify-between items-center p-4 rounded-lg ${bg}`}>
                  <span className={`text-sm font-medium ${text}`}>{label}</span>
                  <Badge variant="outline" className={text}>{value}</Badge>
                </div>
              ))}
            </div>
          </ChartCard>
        );
      case 'topFreelancers':
        return (
          <ChartCard title="Top Freelancers">
            <TopPerformersTable data={data.topFreelancers || []} type="freelancer" />
          </ChartCard>
        );
      case 'topClients':
        return (
          <ChartCard title="Top Clients">
            <TopPerformersTable data={data.topClients || []} type="client" />
          </ChartCard>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Analytics Dashboard"
        description={`Real-time platform insights • ${new Date().toLocaleDateString()}`}
        actions={
          <>
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

            <Button variant="outline" size="sm" onClick={() => window.location.href = '/admin/forecasts'}>
              <TrendingUp className="w-4 h-4 mr-2" />
              ML Forecasts
            </Button>
            
            <div className="relative group">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {['pdf', 'excel', 'csv'].map((format) => (
                  <button
                    key={format}
                    onClick={() => handleExport(format)}
                    disabled={isExporting}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg"
                  >
                    <FileText className="w-4 h-4" />
                    {format.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </>
        }
      />

      {/* Date Range */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Date Range:</span>
          <input
            type="date"
            value={dateRange.startDate}
            max={dateRange.endDate}
            onChange={(e) => handleDateChange('startDate', e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <span className="text-gray-400">—</span>
          <input
            type="date"
            value={dateRange.endDate}
            min={dateRange.startDate}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => handleDateChange('endDate', e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
      </div>

      {/* Metrics Cards */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={metricsOrder} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {metricsOrder.map((widgetId) => (
              <DraggableWidget key={widgetId} id={widgetId} disabled={isLocked}>
                {renderMetric(widgetId)}
              </DraggableWidget>
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeId && metricsOrder.includes(activeId) ? renderMetric(activeId) : null}
        </DragOverlay>
      </DndContext>

      {/* Charts */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={chartsOrder} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {chartsOrder.map((widgetId) => (
              <DraggableWidget key={widgetId} id={widgetId} disabled={isLocked}>
                {renderWidget(widgetId)}
              </DraggableWidget>
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeId && chartsOrder.includes(activeId) ? renderWidget(activeId) : null}
        </DragOverlay>
      </DndContext>

      {/* Statistics */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={statsOrder} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {statsOrder.map((widgetId) => (
              <DraggableWidget key={widgetId} id={widgetId} disabled={isLocked}>
                {renderWidget(widgetId)}
              </DraggableWidget>
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeId && statsOrder.includes(activeId) ? renderWidget(activeId) : null}
        </DragOverlay>
      </DndContext>

      {/* Categories */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={categoriesOrder} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {categoriesOrder.map((widgetId) => (
              <DraggableWidget key={widgetId} id={widgetId} disabled={isLocked}>
                {renderWidget(widgetId)}
              </DraggableWidget>
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeId && categoriesOrder.includes(activeId) ? renderWidget(activeId) : null}
        </DragOverlay>
      </DndContext>

      {/* Top Performers */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={performersOrder} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {performersOrder.map((widgetId) => (
              <DraggableWidget key={widgetId} id={widgetId} disabled={isLocked}>
                {renderWidget(widgetId)}
              </DraggableWidget>
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeId && performersOrder.includes(activeId) ? renderWidget(activeId) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default AnalyticsPro;
