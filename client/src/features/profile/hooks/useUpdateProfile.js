/**
 * useUpdateProfile Hook
 * Update user profile mutation with React Query
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile } from '../../../api/profileApi';
import { toast } from 'react-hot-toast';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData) => updateProfile(profileData),
    onSuccess: () => {
      // Invalidate profile queries
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      
      toast.success('Profile updated successfully! ✨');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
    },
  });
};
