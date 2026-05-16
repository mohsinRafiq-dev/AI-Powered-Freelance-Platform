import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { getNotifications, getUnreadCount, markAsRead, markAllRead, deleteNotification, deleteAllNotifications } from '../../api/notificationsApi';
import chatService from '../../services/chatService';
import toast from 'react-hot-toast';

export const useNotifications = ({ enabled = true } = {}) => {
  const queryClient = useQueryClient();
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  const currentUserId = useSelector((state) => state.auth?.user?._id);

  // Only fetch when caller allows and user is authenticated
  const canFetch = Boolean(enabled && isAuthenticated);

  // Fetch notifications
  const {
    data: notificationsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications({ limit: 50 }),
    enabled: canFetch,
    refetchInterval: canFetch ? 30000 : false,
    staleTime: 10000,
  });

  // Fetch unread count
  const { data: unreadCountData } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: getUnreadCount,
    enabled: canFetch,
    refetchInterval: canFetch ? 30000 : false,
    staleTime: 10000,
  });

  // Mutations
  const markAsReadMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
    onError: (err) => {
      toast.error('Failed to mark notification as read');
      console.error('Mark as read error:', err);
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
      toast.success('All notifications marked as read');
    },
    onError: (err) => {
      toast.error('Failed to mark all notifications as read');
      console.error('Mark all read error:', err);
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
      toast.success('Notification deleted');
    },
    onError: (err) => {
      toast.error('Failed to delete notification');
      console.error('Delete notification error:', err);
    },
  });

  const deleteAllNotificationsMutation = useMutation({
    mutationFn: deleteAllNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
      toast.success('All notifications deleted');
    },
    onError: (err) => {
      toast.error('Failed to delete all notifications');
      console.error('Delete all notifications error:', err);
    },
  });

  // Real-time socket listener: attach when socket exists (independent of canFetch)
  useEffect(() => {
    if (!chatService?.socket || typeof chatService.socket.on !== 'function') return;

    const handleNotification = (notification) => {
      // If notification has a userId, ensure it's for the current user (or for admins)
      if (notification?.userId && currentUserId && notification.userId !== currentUserId) {
        // not for this user
        return;
      }

      console.log('[useNotifications] Received real-time notification:', notification);
      toast.success(notification.title || 'New notification', { duration: 4000 });

      // Refresh queries if user is authenticated (so UI updates)
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
      }
    };

    chatService.socket.on('notification', handleNotification);

    return () => {
      if (chatService.socket?.off) chatService.socket.off('notification', handleNotification);
    };
  }, [queryClient, isAuthenticated, currentUserId]);

  // Normalize response shapes - API returns { success, message, data: { items, pagination } }
  const notifications = notificationsData?.data?.items || notificationsData?.items || notificationsData?.notifications || notificationsData?.data || notificationsData || [];
  const unreadCount = unreadCountData?.data?.count ?? unreadCountData?.count ?? unreadCountData?.unread ?? (Array.isArray(notifications) ? notifications.filter(n => !n.isRead).length : 0);
  
  const handleMarkAsRead = (id) => markAsReadMutation.mutate(id);
  const handleMarkAllRead = () => markAllReadMutation.mutate();
  const handleDeleteNotification = (id) => deleteNotificationMutation.mutate(id);
  const handleDeleteAllNotifications = () => deleteAllNotificationsMutation.mutate();

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead: handleMarkAsRead,
    markAllRead: handleMarkAllRead,
    deleteNotification: handleDeleteNotification,
    deleteAllNotifications: handleDeleteAllNotifications,
    refetch,
  };
};