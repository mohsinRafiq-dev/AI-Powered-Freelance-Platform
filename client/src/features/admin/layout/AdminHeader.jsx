import { useState, useEffect, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Bell,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Moon,
  Sun,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
} from 'lucide-react';
import { logoutUser } from '../../../store/slices/authSlice';
import { Button } from '../../../components/ui/button';
import { createAuditLog } from '../../../api/admin/auditLogsApi';
import { useAdminRole } from '../../../hooks/admin/usePermissions';
import { ADMIN_ROLE_LABELS } from '../../../utils/permissions';
import { useNotifications } from '../../../hooks/api';

const AdminHeader = ({ onToggleSidebar, breadcrumbs = [] }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { adminRole: apiAdminRole, isSuperAdmin, isAdmin, isModerator } = useAdminRole();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const notificationRef = useRef(null);
  
  // Use adminRole from API or fallback to user.adminRole from Redux
  const adminRole = apiAdminRole || user?.adminRole;

  // Notification hook
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllRead,
    isLoading: notificationsLoading,
  } = useNotifications({ enabled: isAuthenticated });

  // Normalize notifications to an array
  const notificationList = useMemo(() => {
    let normalized = [];
    
    if (Array.isArray(notifications)) {
      normalized = notifications;
    } else if (notifications && typeof notifications === 'object') {
      normalized = notifications.items || 
                   notifications.notifications || 
                   (notifications.data && Array.isArray(notifications.data) ? notifications.data : null) ||
                   Object.values(notifications).filter(v => v && typeof v === 'object' && (v.title || v.message || v.type));
    }
    
    return normalized || [];
  }, [notifications]);

  // Format notification date
  const formatNotificationDate = (notification) => {
    if (!notification) return 'Just now';
    
    const raw = notification?.createdAt ?? notification?.created_at ?? notification?.timestamp ?? null;
    if (!raw) return 'Just now';
    
    try {
      const date = new Date(raw);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      
      return date.toLocaleDateString();
    } catch {
      return 'Just now';
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    const icons = {
      success: CheckCircle,
      error: XCircle,
      warning: AlertCircle,
      info: Info,
    };
    return icons[type] || Bell;
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotificationDropdown(false);
      }
    };

    if (showNotificationDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotificationDropdown]);

  // Debug log to check adminRole updates
  useEffect(() => {
    console.log('[AdminHeader] User updated:', { 
      userName: user?.name, 
      userAdminRole: user?.adminRole, 
      apiAdminRole, 
      finalAdminRole: adminRole 
    });
  }, [user, apiAdminRole, adminRole]);
  
  // Get admin role badge color
  const getRoleBadgeColor = () => {
    if (isSuperAdmin || adminRole === 'super_admin') return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    if (isAdmin || adminRole === 'admin') return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    if (isModerator || adminRole === 'moderator') return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark' || 
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = async () => {
    try {
      console.log('[AdminHeader] Logout initiated');
      
      // Create audit log before logging out
      await createAuditLog({
        action: 'ADMIN_LOGOUT',
        details: { timestamp: new Date().toISOString() },
      });
    } catch (error) {
      console.error('Failed to create logout audit log:', error);
    }
    
    // Clear all React Query caches (especially admin permissions)
    queryClient.clear();
    
    // Call logout API which clears token and localStorage
    await dispatch(logoutUser());
    
    // Double-check everything is cleared
    dispatch({ type: 'auth/clearAuth' });
    localStorage.removeItem('redirectAfterAuth');
    localStorage.removeItem('linkify_token');
    sessionStorage.clear();
    
    // Note: We don't sign out of Google accounts globally
    // The prompt=select_account parameter will show account picker on next login
    
    console.log('[AdminHeader] Logout complete, navigating to login');
    
    // Small delay to ensure state is cleared before navigation
    setTimeout(() => {
      navigate('/login', { replace: true });
    }, 100);
  };

  return (
    <header className="flex-shrink-0 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700 shadow-sm z-50 relative">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 hover:bg-brand-light/30 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-brand-deepest dark:text-white" />
          </button>

          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <nav className="hidden sm:flex items-center gap-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center gap-2">
                  {index > 0 && (
                    <span className="text-gray-400 dark:text-gray-600">/</span>
                  )}
                  <span
                    className={
                      index === breadcrumbs.length - 1
                        ? 'text-brand-deepest dark:text-white font-medium'
                        : 'text-gray-600 dark:text-gray-400'
                    }
                  >
                    {crumb}
                  </span>
                </div>
              ))}
            </nav>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
              className="relative p-2 hover:bg-brand-light/30 rounded-lg transition-colors group"
            >
              <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-brand" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            <AnimatePresence>
              {showNotificationDropdown && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotificationDropdown(false)}
                  />

                  {/* Dropdown */}
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.985 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10 overflow-hidden z-[99999]"
                  >
                    {/* Header */}
                    <div className="px-4 py-3 bg-gradient-to-r from-brand/8 to-brand-dark/8 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          Notifications
                        </h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllRead}
                            className="text-xs text-brand hover:text-brand-dark font-medium"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                      {notificationsLoading ? (
                        <div className="p-8 text-center">
                          <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Loading notifications...</p>
                        </div>
                      ) : notificationList.length === 0 ? (
                        <div className="p-8 text-center">
                          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">No notifications</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">You're all caught up!</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                          {notificationList.slice(0, 10).map((notification, index) => {
                            const nid = notification?._id ?? notification?.id ?? `notification-${index}`;
                            const Icon = getNotificationIcon(notification.type);
                            
                            return (
                              <div
                                key={nid}
                                className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${
                                  !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                }`}
                                onClick={() => {
                                  if (!notification.isRead) {
                                    markAsRead(nid);
                                  }
                                  setShowNotificationDropdown(false);
                                  // Navigate if there's a link
                                  if (notification.link) {
                                    navigate(notification.link);
                                  }
                                }}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`flex-shrink-0 mt-0.5 ${
                                    !notification.isRead 
                                      ? 'text-brand dark:text-brand-light' 
                                      : 'text-gray-400 dark:text-gray-500'
                                  }`}>
                                    <Icon className="w-4 h-4" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-sm ${
                                      !notification.isRead
                                        ? 'font-semibold text-gray-900 dark:text-white'
                                        : 'text-gray-700 dark:text-gray-300'
                                    }`}>
                                      {notification.title || notification.message || 'Notification'}
                                    </p>
                                    {notification.message && notification.title && (
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                                        {notification.message}
                                      </p>
                                    )}
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                      {formatNotificationDate(notification)}
                                    </p>
                                  </div>
                                  {!notification.isRead && (
                                    <div className="flex-shrink-0 w-2 h-2 bg-brand rounded-full mt-2"></div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    {notificationList.length > 10 && (
                      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <button
                          onClick={() => {
                            navigate('/admin/notifications');
                            setShowNotificationDropdown(false);
                          }}
                          className="w-full text-center text-xs font-medium text-brand hover:text-brand-dark"
                        >
                          View all notifications
                        </button>
                      </div>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-brand-light/30 rounded-xl transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center shadow-brand">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-brand-deepest dark:text-white flex items-center gap-2">
                  {user?.name || 'Admin'}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getRoleBadgeColor()}`}>
                    {adminRole ? ADMIN_ROLE_LABELS[adminRole] : 'Admin'}
                  </span>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${
                  showProfileMenu ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showProfileMenu && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProfileMenu(false)}
                  />

                  {/* Menu */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-[9999] overflow-hidden"
                    style={{ zIndex: 9999 }}
                  >
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                      <p className="text-sm font-semibold text-brand-deepest dark:text-white">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                        {user?.email}
                      </p>
                    </div>

                    <div className="p-2">
                      {/* Theme Toggle */}
                      <button
                        onClick={toggleTheme}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <span className="flex items-center gap-3">
                          {darkMode ? (
                            <Sun className="w-4 h-4" />
                          ) : (
                            <Moon className="w-4 h-4" />
                          )}
                          Theme
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {darkMode ? 'Dark' : 'Light'}
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          navigate('/admin/settings');
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
