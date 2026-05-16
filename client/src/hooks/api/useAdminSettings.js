import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as adminSettingsAPI from '@/api/admin/adminSettingsApi';
import logger from '@/utils/logger';

// Query keys for cache management
export const ADMIN_SETTINGS_QUERY_KEYS = {
  all: ['admin-settings'],
  settings: ['admin-settings', 'settings'],
  aiStatus: ['admin-settings', 'ai-status'],
};

/**
 * Get admin settings
 */
export const useAdminSettings = (options = {}) => {
  return useQuery({
    queryKey: ADMIN_SETTINGS_QUERY_KEYS.settings,
    queryFn: () => adminSettingsAPI.getAdminSettings(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: options.enabled !== false,
    onError: (error) => {
      logger.error('Failed to fetch admin settings:', error);
      if (options.showErrorToast !== false) {
        toast.error('Failed to load admin settings');
      }
    },
  });
};

/**
 * Update admin settings
 */
export const useUpdateAdminSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates) => adminSettingsAPI.updateAdminSettings(updates),
    onSuccess: (data) => {
      // Update cached settings
      queryClient.setQueryData(ADMIN_SETTINGS_QUERY_KEYS.settings, data);
      // Invalidate AI status
      queryClient.invalidateQueries({ queryKey: ADMIN_SETTINGS_QUERY_KEYS.aiStatus });
      
      logger.info('Admin settings updated successfully:', data);
      toast.success('Settings updated successfully!');
    },
    onError: (error) => {
      logger.error('Failed to update admin settings:', error);
      toast.error(error.response?.data?.message || 'Failed to update settings');
    },
  });
};

/**
 * Get AI feature status (public endpoint - can be used by non-admins)
 */
export const useAIFeatureStatus = (options = {}) => {
  return useQuery({
    queryKey: ADMIN_SETTINGS_QUERY_KEYS.aiStatus,
    queryFn: () => adminSettingsAPI.getAIFeatureStatus(),
    staleTime: 1000 * 60 * 2, // 2 minutes - shorter cache for feature flags
    enabled: options.enabled !== false,
    onError: (error) => {
      logger.error('Failed to fetch AI feature status:', error);
      // Don't show toast for this - it's a background check
    },
  });
};

export default {
  useAdminSettings,
  useUpdateAdminSettings,
  useAIFeatureStatus,
};





