import { useQuery } from '@tanstack/react-query';
import * as analyticsApi from '../../api/admin/analyticsApi';

export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ['admin-analytics-dashboard'],
    queryFn: analyticsApi.getDashboardMetrics,
    refetchInterval: 300000 // Refetch every 5 minutes
  });
};

export const useUserGrowthReport = (startDate, endDate, interval) => {
  return useQuery({
    queryKey: ['user-growth', startDate, endDate, interval],
    queryFn: () => analyticsApi.getUserGrowthReport(startDate, endDate, interval),
    enabled: !!startDate && !!endDate
  });
};

export const useRevenueReport = (startDate, endDate) => {
  return useQuery({
    queryKey: ['revenue-report', startDate, endDate],
    queryFn: () => analyticsApi.getRevenueReport(startDate, endDate),
    enabled: !!startDate && !!endDate
  });
};

export const useCategoryDistribution = () => {
  return useQuery({
    queryKey: ['category-distribution'],
    queryFn: analyticsApi.getCategoryDistribution
  });
};

export const useFlaggedJobsReport = (startDate, endDate) => {
  return useQuery({
    queryKey: ['flagged-jobs', startDate, endDate],
    queryFn: () => analyticsApi.getFlaggedJobsReport(startDate, endDate),
    enabled: !!startDate && !!endDate
  });
};
