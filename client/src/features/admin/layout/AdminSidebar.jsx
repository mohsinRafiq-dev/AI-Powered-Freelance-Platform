import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Settings,
  Shield,
  BarChart3,
  FileText,
  ChevronLeft,
  Activity,
  Scale,
  Star,
  Brain,
} from 'lucide-react';
import { useHasPermission } from '../../../hooks/admin/usePermissions';
import { PERMISSIONS } from '../../../utils/permissions';

const AdminSidebar = ({ isOpen, onClose }) => {
  const hasViewUsers = useHasPermission(PERMISSIONS.VIEW_USERS);
  const hasViewJobs = useHasPermission(PERMISSIONS.VIEW_JOBS);
  const hasViewCnic = useHasPermission(PERMISSIONS.VIEW_CNIC);
  const hasViewAnalytics = useHasPermission(PERMISSIONS.VIEW_ANALYTICS);
  const hasViewAuditLogs = useHasPermission(PERMISSIONS.VIEW_AUDIT_LOGS);
  const hasViewSettings = useHasPermission(PERMISSIONS.VIEW_SETTINGS);
  const hasViewSystemHealth = useHasPermission(PERMISSIONS.VIEW_SETTINGS); // Super admins can view health
  const hasViewDisputes = useHasPermission(PERMISSIONS.VIEW_SETTINGS); // Admins can view disputes

  const allMenuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
      show: true, // Dashboard is always visible
    },
    {
      title: 'User Management',
      icon: Users,
      path: '/admin/users',
      show: hasViewUsers,
    },
    {
      title: 'Job Checker',
      icon: Briefcase,
      path: '/admin/jobs',
      show: hasViewJobs,
    },
    {
      title: 'CNIC Verification',
      icon: Shield,
      path: '/admin/cnic',
      show: hasViewCnic,
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      path: '/admin/analytics',
      show: hasViewAnalytics,
    },
    {
      title: 'Forecasts & Trends',
      icon: Brain,
      path: '/admin/forecasts',
      show: hasViewAnalytics,
    },
    {
      title: 'Audit Logs',
      icon: FileText,
      path: '/admin/audit',
      show: hasViewAuditLogs,
    },
    {
      title: 'Disputes',
      icon: Scale,
      path: '/admin/disputes',
      show: hasViewDisputes,
    },
    {
      title: 'Review Moderation',
      icon: Star,
      path: '/admin/reviews',
      show: hasViewSettings, // Admin can view
    },
    {
      title: 'System Health',
      icon: Activity,
      path: '/admin/health',
      show: hasViewSystemHealth,
    },
    {
      title: 'Settings',
      icon: Settings,
      path: '/admin/settings',
      show: hasViewSettings,
    },
  ];

  // Filter menu items based on permissions
  const menuItems = allMenuItems.filter(item => item.show);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed lg:relative top-0 left-0 h-screen w-72 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-r border-gray-200 dark:border-gray-700 shadow-sm z-50 lg:translate-x-0 lg:!transform-none flex flex-col"
        style={{ transform: window.innerWidth >= 1024 ? 'translateX(0)' : undefined }}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center shadow-brand">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-brand-deepest dark:text-white">
                Admin Portal
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">Linkify Platform</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-brand-light/30 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) {
                  onClose();
                }
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-brand/10 text-brand-deepest dark:text-brand border-l-4 border-brand shadow-soft'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-brand-light/30 dark:hover:bg-gray-800/50'
                } ${item.badge ? 'pointer-events-none opacity-60' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-brand/5 rounded-xl -z-10"
                      transition={{ type: 'spring', duration: 0.5 }}
                    />
                  )}

                  <item.icon
                    className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-brand' : ''
                    }`}
                  />
                  <span className="font-medium flex-1">{item.title}</span>

                  {/* Badge */}
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs font-semibold bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-brand-light/50 dark:border-gray-700/50">
          <div className="px-4 py-3 rounded-xl bg-brand-light/20 dark:bg-gray-800/50">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Version</p>
            <p className="text-sm font-semibold text-brand-deepest dark:text-white">
              v1.0.0
            </p>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default AdminSidebar;
