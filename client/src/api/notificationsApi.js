import axiosInstance from './axiosInstance';
import ENDPOINTS from './endpoints/notifications';

export const getNotifications = async (params = {}) => {
  const response = await axiosInstance.get(ENDPOINTS.NOTIFICATIONS.LIST, { params });
  return response.data;
};

export const getUnreadCount = async () => {
  const response = await axiosInstance.get(ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
  return response.data;
};

export const markAsRead = async (id) => {
  if (!id || id === 'undefined' || id === 'null') {
    throw new Error('Notification ID is required');
  }
  const response = await axiosInstance.patch(ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
  return response.data;
};

export const markAllRead = async () => {
  const response = await axiosInstance.patch(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
  return response.data;
};

export const deleteNotification = async (id) => {
  if (!id || id === 'undefined' || id === 'null') {
    throw new Error('Notification ID is required');
  }
  const response = await axiosInstance.delete(ENDPOINTS.NOTIFICATIONS.DELETE(id));
  return response.data;
};

export const deleteAllNotifications = async () => {
  const response = await axiosInstance.delete(ENDPOINTS.NOTIFICATIONS.DELETE_ALL);
  return response.data;
};

export default {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllRead,
  deleteNotification,
  deleteAllNotifications,
};
