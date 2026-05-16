/**
 * useProfile Hook
 * Fetch user profile by ID (or current user)
 */

import { useQuery } from '@tanstack/react-query';
import { getUserProfile, getMyProfile } from '../../../api/profileApi';

export const useProfile = (userId = null) => {
  return useQuery({
    queryKey: userId ? ['profile', userId] : ['profile', 'me'],
    queryFn: () => userId ? getUserProfile(userId) : getMyProfile(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
