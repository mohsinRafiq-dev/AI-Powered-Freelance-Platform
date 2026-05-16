
import { useQuery } from '@tanstack/react-query';
import { getAllJobs } from '../../../api/jobsApi';

export const useJobs = (filters = {}) => {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => getAllJobs(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    keepPreviousData: true,
  });
};
