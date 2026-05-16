import envConfig from '../app/config/envConfig';
import chatService from './chatService';
import api from '../api/axiosInstance';

let notifications = [];
let listeners = [];

const init = () => {
  if (!envConfig.features.notifications) {
    console.warn('Notifications feature is disabled');
    return;
  }

  // Listen for socket notifications
  if (chatService.socket) {
    chatService.socket.on('notification', (notification) => {
      addNotification(notification);
    });

    // Listen for job moderation events
    chatService.socket.on('job:moderation', (data) => {
      handleJobModerationEvent(data);
    });

    // Listen for job updates (for freelancers browsing)
    chatService.socket.on('jobs:update', (data) => {
      handleJobsUpdateEvent(data);
    });

    // Listen for specific job updates
    chatService.socket.on('job:updated', (data) => {
      handleJobUpdatedEvent(data);
    });
  }

  // Request browser notification permission
  requestPermission();

  // Load persisted notifications from server
  loadPersisted();
};

const loadPersisted = async () => {
  try {
    const res = await api.get('/notifications');
    if (res?.data?.items) {
      // Prepend persisted notifications to local list
      notifications = res.data.items.map(n => ({
        id: n._id,
        title: n.title,
        message: n.message,
        type: n.type,
        read: n.isRead,
        timestamp: n.createdAt,
        link: n.link,
        data: n.data,
      }));
      notifyListeners();
    }
  } catch (err) {
    console.warn('Failed to load notifications', err?.message || err);
  }
};

const markReadServer = async (id) => {
  try {
    await api.patch(`/notifications/${id}/read`);
  } catch (err) {
    console.warn('Failed to mark notification read on server', err?.message || err);
  }
};

const markAllReadServer = async () => {
  try {
    await api.patch(`/notifications/read-all`);
  } catch (err) {
    console.warn('Failed to mark all notifications read on server', err?.message || err);
  }
};

const requestPermission = async () => {
  if ('Notification' in window && Notification.permission === 'default') {
    await Notification.requestPermission();
  }
};

const showBrowserNotification = (notification) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    const { title, message, icon } = notification;
    
    new Notification(title || 'Linkify', {
      body: message,
      icon: icon || '/logo.png',
      badge: '/logo.png',
      tag: notification.id,
    });
  }
};

const addNotification = (notification) => {
  const newNotification = {
    id: notification.id || Date.now().toString(),
    title: notification.title,
    message: notification.message,
    type: notification.type || 'info', 
    read: false,
    timestamp: new Date(),
    ...notification,
  };

  notifications.unshift(newNotification);
  
  // Notify listeners
  notifyListeners();

  // Show browser notification
  showBrowserNotification(newNotification);

  // Auto-remove after 5 seconds for toast-style notifications
  if (notification.autoRemove !== false) {
    setTimeout(() => {
      removeNotification(newNotification.id);
    }, 5000);
  }
};

const removeNotification = (id) => {
  notifications = notifications.filter(n => n.id !== id);
  notifyListeners();
};

const markAsRead = (id) => {
  const notification = notifications.find(n => n.id === id);
  if (notification) {
    notification.read = true;
    notifyListeners();
    markReadServer(id);
  }
};

const markAllAsRead = () => {
  notifications.forEach(n => n.read = true);
  notifyListeners();
  markAllReadServer();
};

const clearAll = () => {
  notifications = [];
  notifyListeners();
};

const getUnreadCount = () => {
  return notifications.filter(n => !n.read).length;
};

// Handler for job moderation events
const handleJobModerationEvent = (data) => {
  const { type, jobId, action, job, moderator, reason, timestamp } = data;
  
  // Get the current user to check if they're the job owner
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Show notification with appropriate message
  let message = '';
  let notificationType = 'info';
  
  switch (action) {
    case 'approved':
      message = `Your job "${job.title}" has been approved and is now live!`;
      notificationType = 'success';
      break;
    case 'rejected':
      message = `Your job "${job.title}" has been rejected${reason ? `: ${reason}` : '.'}`;
      notificationType = 'error';
      break;
    case 'flagged':
      message = `Your job "${job.title}" has been flagged for review${reason ? `: ${reason}` : '.'}`;
      notificationType = 'warning';
      break;
    case 'featured':
      message = `Your job "${job.title}" has been featured!`;
      notificationType = 'success';
      break;
    case 'unfeatured':
      message = `Your job "${job.title}" is no longer featured.`;
      notificationType = 'info';
      break;
    default:
      message = `Your job "${job.title}" status has been updated.`;
  }
  
  // Add notification
  addNotification({
    message,
    type: notificationType,
    link: `/jobs/${jobId}`,
    autoRemove: false,
  });
  
  // Show browser notification if user is job owner
  if (currentUser._id === job.client) {
    showBrowserNotification(message, {
      tag: `job-${jobId}`,
      body: moderator ? `Moderated by ${moderator.name}` : 'Job status updated',
    });
  }
  
  // Invalidate React Query cache
  if (window.queryClient) {
    window.queryClient.invalidateQueries(['jobs', 'my-jobs']);
    window.queryClient.invalidateQueries(['jobs', 'detail', jobId]);
  }
};

// Handler for jobs update events (for freelancers browsing)
const handleJobsUpdateEvent = (data) => {
  const { action, jobId, job } = data;
  
  // Only show subtle notification if user is on jobs page
  const isOnJobsPage = window.location.pathname.includes('/jobs');
  
  if (isOnJobsPage) {
    let message = '';
    
    switch (action) {
      case 'approved':
        message = 'New job available!';
        break;
      case 'flagged':
      case 'rejected':
        // Don't show notification for removed jobs
        break;
      case 'featured':
        message = 'A job has been featured!';
        break;
      default:
        message = 'Job listings updated.';
    }
    
    if (message) {
      toast(message, 'info');
    }
  }
  
  // Invalidate React Query cache
  if (window.queryClient) {
    window.queryClient.invalidateQueries(['jobs', 'list']);
    window.queryClient.invalidateQueries(['jobs', 'featured']);
  }
};

// Handler for specific job update events
const handleJobUpdatedEvent = (data) => {
  const { jobId, updates } = data;
  
  // Invalidate specific job query
  if (window.queryClient) {
    window.queryClient.invalidateQueries(['jobs', 'detail', jobId]);
  }
  
  // If user is viewing this job, show notification
  const isViewingJob = window.location.pathname.includes(`/jobs/${jobId}`);
  
  if (isViewingJob) {
    toast('This job has been updated.', 'info');
  }
};

const subscribe = (callback) => {
  listeners.push(callback);
  
  // Return unsubscribe function
  return () => {
    listeners = listeners.filter(cb => cb !== callback);
  };
};

const notifyListeners = () => {
  listeners.forEach(callback => callback(notifications));
};

const toast = (message, type = 'info') => {
  addNotification({
    message,
    type,
    autoRemove: true,
  });
};

const success = (message) => {
  toast(message, 'success');
};

const error = (message) => {
  toast(message, 'error');
};

const warning = (message) => {
  toast(message, 'warning');
};

const info = (message) => {
  toast(message, 'info');
};

const notificationService = {
  init,
  requestPermission,
  showBrowserNotification,
  addNotification,
  removeNotification,
  markAsRead,
  markAllAsRead,
  clearAll,
  getUnreadCount,
  subscribe,
  notifyListeners,
  toast,
  success,
  error,
  warning,
  info,
};

export {
  handleJobModerationEvent,
  handleJobsUpdateEvent,
  handleJobUpdatedEvent,
  loadPersisted,
  markReadServer,
  markAllReadServer,
};

export default notificationService;
