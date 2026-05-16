import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, DollarSign, TrendingUp, Briefcase, FileCheck, Clock, AlertCircle, GripVertical } from 'lucide-react';
import StatCard from '../../dashboard/shared/StatCard';
import { Card } from '../../../components/ui/card';
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
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Draggable Widget Component
const DraggableWidget = ({ id, children, className }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`relative group ${className}`}>
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 z-10 p-2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-sm"
      >
        <GripVertical className="w-4 h-4 text-gray-500" />
      </div>
      {children}
    </div>
  );
};

const AdminDashboard = () => {
  // Separate state for stat cards and chart widgets
  const [statCardsOrder, setStatCardsOrder] = useState(() => {
    const saved = localStorage.getItem('adminStatCardsLayout');
    return saved ? JSON.parse(saved) : [
      'totalUsers', 'activeUsers', 'totalRevenue', 'platformFees',
      'totalJobs', 'completedJobs', 'pendingVerifications', 'avgResponseTime'
    ];
  });

  const [chartsOrder, setChartsOrder] = useState(() => {
    const saved = localStorage.getItem('adminChartsLayout');
    return saved ? JSON.parse(saved) : [
      'userGrowthChart', 'roleDistributionChart', 'revenueChart', 'quickStats'
    ];
  });

  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Save layouts to localStorage
  useEffect(() => {
    localStorage.setItem('adminStatCardsLayout', JSON.stringify(statCardsOrder));
  }, [statCardsOrder]);

  useEffect(() => {
    localStorage.setItem('adminChartsLayout', JSON.stringify(chartsOrder));
  }, [chartsOrder]);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      // Check if it's a stat card
      if (statCardsOrder.includes(active.id)) {
        setStatCardsOrder((items) => {
          const oldIndex = items.indexOf(active.id);
          const newIndex = items.indexOf(over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
      // Check if it's a chart
      else if (chartsOrder.includes(active.id)) {
        setChartsOrder((items) => {
          const oldIndex = items.indexOf(active.id);
          const newIndex = items.indexOf(over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    }

    setActiveId(null);
  };

  // TODO: Replace with actual API data
  const metrics = {
    totalUsers: 1247,
    activeUsers: 856,
    totalRevenue: 125000,
    platformFees: 12500,
    totalJobs: 245,
    completedJobs: 178,
    pendingVerifications: 23,
    avgResponseTime: 2.4,
  };

  const trends = {
    totalUsers: 12.5,
    activeUsers: 8.3,
    totalRevenue: 15.7,
    platformFees: 15.7,
    totalJobs: 8.2,
    completedJobs: 5.4,
    pendingVerifications: -12.3,
    avgResponseTime: -8.1,
  };

  // User Growth Chart Data (Last 6 months)
  const userGrowthData = {
    labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Total Users',
        data: [850, 920, 1050, 1120, 1180, 1247],
        borderColor: '#84A98C',
        backgroundColor: 'rgba(132, 169, 140, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Active Users',
        data: [620, 680, 750, 790, 820, 856],
        borderColor: '#52796F',
        backgroundColor: 'rgba(82, 121, 111, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
            weight: 500,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#2F3E46',
        bodyColor: '#354F52',
        borderColor: '#CAD2C5',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(132, 169, 140, 0.1)',
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
    },
  };

  // Role Distribution Pie Chart Data
  const roleDistributionData = {
    labels: ['Freelancers', 'Clients', 'Admins'],
    datasets: [
      {
        data: [750, 485, 12],
        backgroundColor: [
          'rgba(132, 169, 140, 0.8)',
          'rgba(82, 121, 111, 0.8)',
          'rgba(53, 79, 82, 0.8)',
        ],
        borderColor: [
          '#84A98C',
          '#52796F',
          '#354F52',
        ],
        borderWidth: 2,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
            weight: 500,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#2F3E46',
        bodyColor: '#354F52',
        borderColor: '#CAD2C5',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context) => {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          },
        },
      },
    },
  };

  // Revenue Chart Data
  const revenueData = {
    labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue',
        data: [95000, 105000, 118000, 122000, 119000, 125000],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Widget configurations
  const widgetConfigs = {
    totalUsers: {
      title: "Total Users",
      value: metrics.totalUsers.toLocaleString(),
      subtitle: "Registered accounts",
      icon: Users,
      iconBg: "bg-gradient-to-br from-brand to-brand-dark",
      trend: trends.totalUsers,
    },
    activeUsers: {
      title: "Active Users",
      value: metrics.activeUsers.toLocaleString(),
      subtitle: "Last 30 days",
      icon: UserCheck,
      iconBg: "bg-gradient-to-br from-brand to-brand-dark",
      trend: trends.activeUsers,
    },
    totalRevenue: {
      title: "Total Revenue",
      value: `Rs. ${(metrics.totalRevenue / 1000).toFixed(1)}K`,
      subtitle: "All transactions",
      icon: DollarSign,
      iconBg: "bg-gradient-to-br from-brand to-brand-dark",
      trend: trends.totalRevenue,
    },
    platformFees: {
      title: "Platform Fees",
      value: `Rs. ${(metrics.platformFees / 1000).toFixed(1)}K`,
      subtitle: "Commission earned",
      icon: TrendingUp,
      iconBg: "bg-gradient-to-br from-brand to-brand-dark",
      trend: trends.platformFees,
    },
    totalJobs: {
      title: "Total Jobs",
      value: metrics.totalJobs.toLocaleString(),
      subtitle: "Posted on platform",
      icon: Briefcase,
      iconBg: "bg-gradient-to-br from-brand to-brand-dark",
      trend: trends.totalJobs,
    },
    completedJobs: {
      title: "Completed Jobs",
      value: metrics.completedJobs.toLocaleString(),
      subtitle: "Successfully finished",
      icon: FileCheck,
      iconBg: "bg-gradient-to-br from-brand to-brand-dark",
      trend: trends.completedJobs,
    },
    pendingVerifications: {
      title: "Pending CNICs",
      value: metrics.pendingVerifications.toLocaleString(),
      subtitle: "Awaiting verification",
      icon: AlertCircle,
      iconBg: "bg-gradient-to-br from-yellow-500 to-yellow-600",
      trend: trends.pendingVerifications,
    },
    avgResponseTime: {
      title: "Avg Response Time",
      value: `${metrics.avgResponseTime}h`,
      subtitle: "Support tickets",
      icon: Clock,
      iconBg: "bg-gradient-to-br from-brand to-brand-dark",
      trend: trends.avgResponseTime,
    },
  };

  // Render stat card
  const renderStatCard = (widgetId) => {
    const config = widgetConfigs[widgetId];
    if (!config) return null;
    
    return (
      <StatCard
        title={config.title}
        value={config.value}
        subtitle={config.subtitle}
        icon={config.icon}
        iconBg={config.iconBg}
        trend={config.trend}
        trendLabel="vs last month"
      />
    );
  };

  // Render chart widget
  const renderChart = (widgetId) => {
    switch (widgetId) {
      case 'userGrowthChart':
        return (
          <Card glass className="p-6 h-[400px]">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-brand-deepest dark:text-white mb-1">
                User Growth
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total and active users over the last 6 months
              </p>
            </div>
            <div className="h-[300px]">
              <Line data={userGrowthData} options={chartOptions} />
            </div>
          </Card>
        );

      case 'roleDistributionChart':
        return (
          <Card glass className="p-6 h-[400px]">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-brand-deepest dark:text-white mb-1">
                Role Distribution
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                User breakdown by role
              </p>
            </div>
            <div className="h-[300px] flex items-center justify-center">
              <Pie data={roleDistributionData} options={pieChartOptions} />
            </div>
          </Card>
        );

      case 'revenueChart':
        return (
          <Card glass className="p-6 h-[400px]">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-brand-deepest dark:text-white mb-1">
                Revenue Trends
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Platform revenue over the last 6 months
              </p>
            </div>
            <div className="h-[300px]">
              <Line data={revenueData} options={chartOptions} />
            </div>
          </Card>
        );

      case 'quickStats':
        return (
          <Card glass className="p-6">
            <h2 className="text-xl font-bold text-brand-deepest dark:text-white mb-4">
              Quick Stats
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-xl bg-brand-light/20 dark:bg-gray-800/50">
                <p className="text-2xl font-bold text-brand-deepest dark:text-white">
                  245
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Jobs Posted
                </p>
              </div>
              <div className="text-center p-4 rounded-xl bg-brand-light/20 dark:bg-gray-800/50">
                <p className="text-2xl font-bold text-brand-deepest dark:text-white">
                  178
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Jobs Completed
                </p>
              </div>
              <div className="text-center p-4 rounded-xl bg-brand-light/20 dark:bg-gray-800/50">
                <p className="text-2xl font-bold text-brand-deepest dark:text-white">
                  892
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Total Proposals
                </p>
              </div>
              <div className="text-center p-4 rounded-xl bg-brand-light/20 dark:bg-gray-800/50">
                <p className="text-2xl font-bold text-brand-deepest dark:text-white">
                  96.5%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Success Rate
                </p>
              </div>
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-deepest dark:text-white mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor your platform's key metrics and performance. Drag widgets to rearrange.
          </p>
        </div>
      </div>

      {/* Draggable Stat Cards */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={statCardsOrder} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCardsOrder.map((widgetId) => (
              <DraggableWidget key={widgetId} id={widgetId}>
                {renderStatCard(widgetId)}
              </DraggableWidget>
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeId && statCardsOrder.includes(activeId) ? renderStatCard(activeId) : null}
        </DragOverlay>
      </DndContext>

      {/* Draggable Charts Section */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={chartsOrder} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {chartsOrder.map((widgetId) => (
              <DraggableWidget 
                key={widgetId} 
                id={widgetId}
                className={widgetId === 'userGrowthChart' || widgetId === 'revenueChart' ? 'lg:col-span-2' : ''}
              >
                {renderChart(widgetId)}
              </DraggableWidget>
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeId && chartsOrder.includes(activeId) ? renderChart(activeId) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default AdminDashboard;
