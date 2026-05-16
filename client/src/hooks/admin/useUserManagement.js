import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import userManagementApi from '../../api/admin/userManagementApi';

// Get all users with filters
export const useUsers = (filters) => {
  return useQuery({
    queryKey: ['admin-users', filters],
    queryFn: () => userManagementApi.getUsers(filters),
    keepPreviousData: true,
  });
};

// Get single user by ID
export const useUser = (userId) => {
  return useQuery({
    queryKey: ['admin-user', userId],
    queryFn: () => userManagementApi.getUserById(userId),
    enabled: !!userId,
  });
};

// Get user activity
export const useUserActivity = (userId) => {
  return useQuery({
    queryKey: ['admin-user-activity', userId],
    queryFn: () => userManagementApi.getUserActivity(userId),
    enabled: !!userId,
  });
};

// Suspend user
export const useSuspendUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, reason }) => userManagementApi.suspendUser(userId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users']);
      queryClient.invalidateQueries(['admin-user']);
      toast.success('User suspended successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to suspend user');
    },
  });
};

// Ban user
export const useBanUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, reason }) => userManagementApi.banUser(userId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users']);
      queryClient.invalidateQueries(['admin-user']);
      toast.success('User banned successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to ban user');
    },
  });
};

// Activate user
export const useActivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) => userManagementApi.activateUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users']);
      queryClient.invalidateQueries(['admin-user']);
      toast.success('User activated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to activate user');
    },
  });
};

// Export users
export const useExportUsers = () => {
  return useMutation({
    mutationFn: ({ filters, format }) => userManagementApi.exportUsers(filters, format),
    onSuccess: (blob, variables) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `users-export-${Date.now()}.${variables.format === 'excel' ? 'xlsx' : 'csv'}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Users exported successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to export users');
    },
  });
};
