import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import toast from 'react-hot-toast';

/**
 * Get current payment mode
 */
export const usePaymentMode = () => {
  return useQuery({
    queryKey: ['paymentMode'],
    queryFn: async () => {
      const response = await axiosInstance.get('/admin/payments/mode');
      return response.data;
    },
    staleTime: 30000, // 30 seconds
  });
};

/**
 * Update payment mode
 */
export const useUpdatePaymentMode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mode) => {
      const response = await axiosInstance.post('/admin/payments/mode', { mode });
      return response.data;
    },
    onSuccess: (data, mode) => {
      queryClient.invalidateQueries(['paymentMode']);
      toast.success(`Payment mode updated to ${mode}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update payment mode');
    },
  });
};

