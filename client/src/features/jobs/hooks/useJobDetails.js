import { useQuery } from '@tanstack/react-query';
import { getJobById } from '../../../api/jobsApi';

export const useJobDetails = (id) => {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => getJobById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};
