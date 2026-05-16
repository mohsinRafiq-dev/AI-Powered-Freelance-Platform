import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as envVarsAPI from '@/api/admin/envVarsApi';
import logger from '@/utils/logger';

// Query keys for cache management
export const ENV_VARS_QUERY_KEYS = {
  all: ['env-vars'],
  list: ['env-vars', 'list'],
  detail: (key) => ['env-vars', 'detail', key],
  public: ['env-vars', 'public'],
};

/**
 * Get all environment variables
 */
export const useEnvVars = (options = {}) => {
  return useQuery({
    queryKey: ENV_VARS_QUERY_KEYS.list,
    queryFn: () => envVarsAPI.getEnvVars(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: options.enabled !== false,
    onError: (error) => {
      logger.error('Failed to fetch environment variables:', error);
      if (options.showErrorToast !== false) {
        toast.error('Failed to load environment variables');
      }
    },
  });
};

/**
 * Get a single environment variable
 */
export const useEnvVar = (key, options = {}) => {
  return useQuery({
    queryKey: ENV_VARS_QUERY_KEYS.detail(key),
    queryFn: () => envVarsAPI.getEnvVar(key),
    enabled: !!key && options.enabled !== false,
    onError: (error) => {
      logger.error('Failed to fetch environment variable:', error);
    },
  });
};

/**
 * Create or update an environment variable
 */
export const useSetEnvVar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => envVarsAPI.setEnvVar(data),
    onSuccess: (data, variables) => {
      // Invalidate list
      queryClient.invalidateQueries({ queryKey: ENV_VARS_QUERY_KEYS.list });
      // Invalidate specific variable if key provided
      if (variables.key) {
        queryClient.invalidateQueries({ 
          queryKey: ENV_VARS_QUERY_KEYS.detail(variables.key) 
        });
      }
      
      logger.info('Environment variable saved successfully:', data);
      toast.success('Environment variable saved successfully!');
    },
    onError: (error) => {
      logger.error('Failed to save environment variable:', error);
      toast.error(error.response?.data?.message || 'Failed to save environment variable');
    },
  });
};

/**
 * Update an environment variable
 */
export const useUpdateEnvVar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, ...data }) => envVarsAPI.updateEnvVar(key, data),
    onSuccess: (data, variables) => {
      // Invalidate list and specific variable
      queryClient.invalidateQueries({ queryKey: ENV_VARS_QUERY_KEYS.list });
      queryClient.invalidateQueries({ 
        queryKey: ENV_VARS_QUERY_KEYS.detail(variables.key) 
      });
      
      logger.info('Environment variable updated successfully:', data);
      toast.success('Environment variable updated successfully!');
    },
    onError: (error) => {
      logger.error('Failed to update environment variable:', error);
      toast.error(error.response?.data?.message || 'Failed to update environment variable');
    },
  });
};

/**
 * Delete an environment variable
 */
export const useDeleteEnvVar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (key) => envVarsAPI.deleteEnvVar(key),
    onSuccess: (data, key) => {
      // Invalidate list and specific variable
      queryClient.invalidateQueries({ queryKey: ENV_VARS_QUERY_KEYS.list });
      queryClient.invalidateQueries({ 
        queryKey: ENV_VARS_QUERY_KEYS.detail(key) 
      });
      
      logger.info('Environment variable deleted successfully:', data);
      toast.success('Environment variable deleted successfully!');
    },
    onError: (error) => {
      logger.error('Failed to delete environment variable:', error);
      toast.error(error.response?.data?.message || 'Failed to delete environment variable');
    },
  });
};

/**
 * Bulk set environment variables
 */
export const useSetBulkEnvVars = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables) => envVarsAPI.setBulkEnvVars(variables),
    onSuccess: (data) => {
      // Invalidate list
      queryClient.invalidateQueries({ queryKey: ENV_VARS_QUERY_KEYS.list });
      
      logger.info('Environment variables saved successfully:', data);
      toast.success('Environment variables saved successfully!');
    },
    onError: (error) => {
      logger.error('Failed to save environment variables:', error);
      toast.error(error.response?.data?.message || 'Failed to save environment variables');
    },
  });
};

/**
 * Get public environment variables (for frontend)
 */
export const usePublicEnvVars = (options = {}) => {
  return useQuery({
    queryKey: ENV_VARS_QUERY_KEYS.public,
    queryFn: () => envVarsAPI.getPublicEnvVars(),
    staleTime: 1000 * 60 * 10, // 10 minutes
    enabled: options.enabled !== false,
    onError: (error) => {
      logger.error('Failed to fetch public environment variables:', error);
      // Don't show toast for this - it's a background check
    },
  });
};

export default {
  useEnvVars,
  useEnvVar,
  useSetEnvVar,
  useUpdateEnvVar,
  useDeleteEnvVar,
  useSetBulkEnvVars,
  usePublicEnvVars,
};

