/**
 * CNIC Verification Hooks
 * React Query hooks for CNIC verification operations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  submitCNIC, 
  getMyCNICStatus,
  getPendingCNICs,
  approveCNIC,
  rejectCNIC
} from '../../../api/cnicApi';
import { toast } from 'react-hot-toast';

// Submit CNIC for Verification (with both images in one request)
export const useSubmitCNIC = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) => submitCNIC(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cnicStatus'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('CNIC submitted successfully! Waiting for admin review.');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to submit CNIC';
      toast.error(message);
    },
  });
};

// Get CNIC Status
export const useCNICStatus = () => {
  return useQuery({
    queryKey: ['cnicStatus'],
    queryFn: async () => {
      const response = await getMyCNICStatus();
      return response.data || response;
    },
    staleTime: 30000, // 30 seconds
  });
};

// Admin - Get Pending CNIC Verifications
export const usePendingCNICVerifications = (filters = {}) => {
  return useQuery({
    queryKey: ['pendingCNICVerifications', filters],
    queryFn: async () => {
      const response = await getPendingCNICs(filters);
      return response.data || response;
    },
    enabled: true,
  });
};

// Admin - Approve CNIC
export const useApproveCNIC = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, cnicData }) => approveCNIC(userId, cnicData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingCNICVerifications'] });
      toast.success('CNIC approved successfully! ✅');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to approve CNIC';
      toast.error(message);
    },
  });
};

// Admin - Reject CNIC
export const useRejectCNIC = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, reason }) => rejectCNIC(userId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingCNICVerifications'] });
      toast.success('CNIC rejected successfully.');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to reject CNIC';
      toast.error(message);
    },
  });
};

// Legacy - Verify/Reject CNIC (deprecated, redirects to new hooks)
export const useVerifyCNIC = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, status, rejectionReason }) => {
      // Redirect to appropriate API call
      if (status === 'verified') {
        return approveCNIC(userId, { number: '', fullName: '', dateOfBirth: '', issueDate: '', expiryDate: '' });
      } else {
        return rejectCNIC(userId, rejectionReason || 'Not specified');
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pendingCNICVerifications'] });
      queryClient.invalidateQueries({ queryKey: ['cnicStatus'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      
      const message = variables.status === 'verified' 
        ? 'CNIC verified successfully! ✅' 
        : 'CNIC rejected. Reason sent to user.';
      toast.success(message);
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update CNIC verification';
      toast.error(message);
    },
  });
};

