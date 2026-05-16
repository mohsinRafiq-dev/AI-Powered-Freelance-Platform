/**
 * usePortfolio Hooks
 * Portfolio management mutations (Add, Update, Delete)
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  uploadPortfolioImage,
} from '../../../api/profileApi';
import { toast } from 'react-hot-toast';

/**
 * Add portfolio item hook
 */
export const useAddPortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (portfolioData) => addPortfolioItem(portfolioData),
    onSuccess: () => {
      // Invalidate all profile queries (both 'me' and userId variants)
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Portfolio item added! 🎨');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to add portfolio item';
      toast.error(message);
    },
  });
};

/**
 * Update portfolio item hook
 */
export const useUpdatePortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ portfolioId, data }) => updatePortfolioItem(portfolioId, data),
    onSuccess: () => {
      // Invalidate all profile queries
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Portfolio item updated! ✨');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update portfolio item';
      toast.error(message);
    },
  });
};

/**
 * Delete portfolio item hook
 */
export const useDeletePortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (portfolioId) => deletePortfolioItem(portfolioId),
    onSuccess: () => {
      // Invalidate all profile queries
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Portfolio item deleted! 🗑️');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to delete portfolio item';
      toast.error(message);
    },
  });
};

/**
 * Upload portfolio image hook
 */
export const useUploadPortfolioImage = () => {
  return useMutation({
    mutationFn: (file) => uploadPortfolioImage(file),
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to upload image';
      toast.error(message);
    },
  });
};
