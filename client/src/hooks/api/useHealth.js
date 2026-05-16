import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as healthAPI from '@/api/admin/healthApi';
import logger from '@/utils/logger';

const HEALTH_QUERY_KEYS = {
  dashboard: ['health', 'dashboard'],
  system: ['health', 'system'],
  ai: ['health', 'ai'],
  circuitBreaker: ['health', 'circuit-breaker'],
};

/**
 * Get health dashboard
 */
export const useHealthDashboard = (options = {}) => {
  return useQuery({
    queryKey: HEALTH_QUERY_KEYS.dashboard,
    queryFn: () => healthAPI.getHealthDashboard(),
    refetchInterval: options.refetchInterval || 5000, // Auto-refresh every 5s
    staleTime: 1000,
    onError: (error) => {
      logger.error('Failed to fetch health dashboard:', error);
      if (options.showErrorToast !== false) {
        toast.error('Failed to load health dashboard');
      }
    },
  });
};

/**
 * Get system health
 */
export const useSystemHealth = (options = {}) => {
  return useQuery({
    queryKey: HEALTH_QUERY_KEYS.system,
    queryFn: () => healthAPI.getSystemHealth(),
    refetchInterval: options.refetchInterval || 10000,
    staleTime: 1000,
    onError: (error) => {
      logger.error('Failed to fetch system health:', error);
    },
  });
};

/**
 * Get AI health
 */
export const useAIHealth = (options = {}) => {
  return useQuery({
    queryKey: HEALTH_QUERY_KEYS.ai,
    queryFn: () => healthAPI.getAIHealth(),
    refetchInterval: options.refetchInterval || 10000,
    staleTime: 1000,
    onError: (error) => {
      logger.error('Failed to fetch AI health:', error);
    },
  });
};

/**
 * Get circuit breaker stats
 */
export const useCircuitBreakerStats = (options = {}) => {
  return useQuery({
    queryKey: HEALTH_QUERY_KEYS.circuitBreaker,
    queryFn: () => healthAPI.getCircuitBreakerStats(),
    refetchInterval: options.refetchInterval || 5000,
    staleTime: 1000,
    onError: (error) => {
      logger.error('Failed to fetch circuit breaker stats:', error);
    },
  });
};

/**
 * Reset circuit breaker
 */
export const useResetCircuitBreaker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => healthAPI.resetCircuitBreaker(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HEALTH_QUERY_KEYS.circuitBreaker });
      queryClient.invalidateQueries({ queryKey: HEALTH_QUERY_KEYS.ai });
      queryClient.invalidateQueries({ queryKey: HEALTH_QUERY_KEYS.dashboard });
      toast.success('Circuit breaker reset successfully');
    },
    onError: (error) => {
      logger.error('Failed to reset circuit breaker:', error);
      toast.error('Failed to reset circuit breaker');
    },
  });
};

export default {
  useHealthDashboard,
  useSystemHealth,
  useAIHealth,
  useCircuitBreakerStats,
  useResetCircuitBreaker,
};
