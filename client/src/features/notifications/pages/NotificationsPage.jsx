import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Trash2, 
  Check, 
  CheckCheck, 
  Filter,
  Search,
  X,
  MessageSquare,
  Briefcase,
  FileText,
  CreditCard,
  User,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { useNotifications } from '../../../hooks/api';
import { Loader } from '../../../components/common/Loader';
import { Button } from '../../../components/ui/button';
import toast from 'react-hot-toast';

// Helper to format notification date
const formatNotificationDate = (notification) => {
  if (!notification) {
    return { date: 'Just now', time: '' };
  }

  const raw = notification?.createdAt ?? notification?.created_at ?? notification?.timestamp ?? null;
  let d = null;

  if (raw) {
    if (raw instanceof Date) {
      d = raw;
    } else if (typeof raw === 'string') {
      d = new Date(raw);
      if (Number.isNaN(d.getTime())) {
        d = null;
      }
    } else if (typeof raw === 'number') {
      const timestamp = raw < 946684800000 ? raw * 1000 : raw;
      d = new Date(timestamp);
      if (Number.isNaN(d.getTime())) {
        d = null;
      }
    } else if (raw && typeof raw === 'object' && 'getTime' in raw && typeof raw.getTime === 'function') {
      try {
        d = new Date(raw.getTime());
      } catch (e) {
        d = null;
      }
    }
  }

  if ((!d || Number.isNaN(d.getTime())) && notification?._id) {
    try {
      const idStr = String(notification._id);
      if (idStr.length >= 8 && /^[0-9a-fA-F]{24}$/.test(idStr)) {
        const hexTimestamp = idStr.substring(0, 8);
        const ts = parseInt(hexTimestamp, 16) * 1000;
        d = new Date(ts);
        if (Number.isNaN(d.getTime())) {
          d = null;
        }
      }
    } catch (e) {
      d = null;
    }
  }

  if (!d || Number.isNaN(d.getTime())) {
    return { date: 'Just now', time: '' };
  }

  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return { date: 'Just now', time: '' };
  } else if (diffMins < 60) {
    return { date: `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`, time: '' };
  } else if (diffHours < 24) {
    return { date: `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`, time: '' };
  } else if (diffDays < 7) {
    return { date: `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`, time: '' };
  }

  try {
    const isToday = d.toDateString() === now.toDateString();
    const isYesterday = d.toDateString() === new Date(now.getTime() - 86400000).toDateString();
    
    if (isToday) {
      return {
        date: 'Today',
        time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };
    } else if (isYesterday) {
      return {
        date: 'Yesterday',
        time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };
    } else {
      return {
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined }),
        time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };
    }
  } catch (e) {
    return { date: d.toLocaleDateString(), time: d.toLocaleTimeString() };
  }
};

// Get icon based on notification type
const getNotificationIcon = (type) => {
  const iconMap = {
    message_received: MessageSquare,
    job_posted: Briefcase,
    proposal_received: FileText,
    proposal_accepted: CheckCircle,
    proposal_rejected: XCircle,
    job_completed: CheckCircle,
    payment_received: CreditCard,
    review_received: User,
    default: Bell,
  };
  return iconMap[type] || iconMap.default;
};

// Get notification color based on type
const getNotificationColor = (type, isRead) => {
  if (isRead) {
    return 'text-gray-400 dark:text-gray-500';
  }
  const colorMap = {
    message_received: 'text-blue-500',
    job_posted: 'text-green-500',
    proposal_received: 'text-purple-500',
    proposal_accepted: 'text-green-500',
    proposal_rejected: 'text-red-500',
    job_completed: 'text-green-500',
    payment_received: 'text-yellow-500',
    review_received: 'text-indigo-500',
    default: 'text-brand',
  };
  return colorMap[type] || colorMap.default;
};

function NotificationsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState(new Set());

  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllRead,
    deleteNotification,
    deleteAllNotifications,
    refetch,
  } = useNotifications({ enabled: true });

  // Normalize notifications to array
  // Handle both direct arrays and wrapped responses
  const notificationList = useMemo(() => {
    return Array.isArray(notifications)
      ? notifications
      : notifications && typeof notifications === 'object'
      ? notifications.items || notifications.notifications || (notifications.data && Array.isArray(notifications.data) ? notifications.data : Object.values(notifications))
      : [];
  }, [notifications]);

  // Filter and search notifications
  const filteredNotifications = useMemo(() => {
    let filtered = notificationList;

    // Apply read/unread filter
    if (filter === 'unread') {
      filtered = filtered.filter(n => !n.isRead);
    } else if (filter === 'read') {
      filtered = filtered.filter(n => n.isRead);
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(n => {
        const title = (n.title || '').toLowerCase();
        const message = (n.message || '').toLowerCase();
        const type = (n.type || '').toLowerCase();
        return title.includes(query) || message.includes(query) || type.includes(query);
      });
    }

    return filtered;
  }, [notificationList, filter, searchQuery]);

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      const nid = notification._id ?? notification.id;
      if (nid) {
        markAsRead(nid);
      }
    }

    const data = notification.data || notification.payload || {};
    if (data.jobId) {
      navigate(`/jobs/${data.jobId}`);
    } else if (data.contractId) {
      navigate(`/contracts/${data.contractId}`);
    } else if (data.conversationId) {
      navigate(`/messages/${data.conversationId}`);
    } else if (notification.link) {
      navigate(notification.link);
    }
  };

  const handleSelectNotification = (notificationId) => {
    const newSelected = new Set(selectedNotifications);
    if (newSelected.has(notificationId)) {
      newSelected.delete(notificationId);
    } else {
      newSelected.add(notificationId);
    }
    setSelectedNotifications(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedNotifications.size === filteredNotifications.length) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(new Set(filteredNotifications.map(n => n._id ?? n.id)));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedNotifications.size === 0) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedNotifications.size} notification(s)?`
    );

    if (confirmDelete) {
      selectedNotifications.forEach(id => {
        deleteNotification(id);
      });
      setSelectedNotifications(new Set());
    }
  };

  const handleDeleteAll = () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete all notifications? This action cannot be undone.'
    );

    if (confirmDelete) {
      deleteAllNotifications();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  // Check if we're in admin context (URL contains /admin)
  const isAdminContext = location.pathname.includes('/admin');

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isAdminContext ? 'p-6' : 'pt-24 lg:pt-28 pb-8 px-4 sm:px-6 lg:px-8'}`}>
      <div className={`${isAdminContext ? '' : 'max-w-4xl'} mx-auto`}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-brand/10 rounded-xl">
                <Bell className="h-6 w-6 text-brand" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {notificationList.length > 0 && (
                <>
                  {unreadCount > 0 && (
                    <Button
                      onClick={markAllRead}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <CheckCheck className="h-4 w-4" />
                      <span>Mark all read</span>
                    </Button>
                  )}
                  <Button
                    onClick={handleDeleteAll}
                    variant="outline"
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete all</span>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-brand text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'unread'
                    ? 'bg-brand text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700'
                }`}
              >
                Unread ({notificationList.filter(n => !n.isRead).length})
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'read'
                    ? 'bg-brand text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700'
                }`}
              >
                Read
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedNotifications.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-brand/10 dark:bg-brand/20 rounded-lg flex items-center justify-between"
          >
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {selectedNotifications.size} notification(s) selected
            </span>
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleSelectAll}
                variant="outline"
                size="sm"
              >
                {selectedNotifications.size === filteredNotifications.length ? 'Deselect all' : 'Select all'}
              </Button>
              <Button
                onClick={handleDeleteSelected}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete selected
              </Button>
            </div>
          </motion.div>
        )}

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'No notifications found' : 'No notifications yet'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery
                ? 'Try adjusting your search or filter'
                : 'You\'re all caught up! New notifications will appear here.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {filteredNotifications.map((notification, index) => {
                const nid = notification._id ?? notification.id ?? `notification-${index}`;
                const Icon = getNotificationIcon(notification.type);
                const iconColor = getNotificationColor(notification.type, notification.isRead);
                const dateInfo = formatNotificationDate(notification);
                const isSelected = selectedNotifications.has(nid);

                return (
                  <motion.div
                    key={nid}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                    className={`group relative bg-white dark:bg-gray-800 rounded-xl border transition-all cursor-pointer ${
                      !notification.isRead
                        ? 'border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/10'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    } ${isSelected ? 'ring-2 ring-brand' : ''}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="p-4 flex items-start space-x-4">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectNotification(nid);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-1 h-4 w-4 text-brand focus:ring-brand border-gray-300 rounded"
                      />

                      {/* Icon */}
                      <div className={`flex-shrink-0 p-2 rounded-lg ${iconColor} bg-opacity-10`}>
                        <Icon className="h-5 w-5" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold text-gray-900 dark:text-white ${
                              !notification.isRead ? 'font-bold' : ''
                            }`}>
                              {notification.title || notification.type || 'Notification'}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                              {notification.message || 'No message available'}
                            </p>
                            <div className="flex items-center space-x-3 mt-2">
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {dateInfo.time ? `${dateInfo.date} at ${dateInfo.time}` : dateInfo.date}
                              </p>
                              {notification.type && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                                  {notification.type.replace('_', ' ')}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-2 ml-4">
                            {!notification.isRead && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(nid);
                                }}
                                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                title="Mark as read"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm('Are you sure you want to delete this notification?')) {
                                  deleteNotification(nid);
                                }
                              }}
                              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                              title="Delete notification"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationsPage;

