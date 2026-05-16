/**
 * useUploadAvatar Hook
 * Upload avatar mutation with React Query
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadAvatar } from '../../../api/profileApi';
import { toast } from 'react-hot-toast';

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file) => uploadAvatar(file),
    onSuccess: () => {
      // Invalidate profile queries
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      
      toast.success('Avatar uploaded successfully! 📸');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to upload avatar';
      toast.error(message);
    },
  });
};
