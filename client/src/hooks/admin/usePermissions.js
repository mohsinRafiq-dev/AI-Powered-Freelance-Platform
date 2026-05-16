import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// Fetch admin permissions
const fetchPermissions = async () => {
  const response = await axiosInstance.get('/admin/permissions');
  return response.data.data;
};

/**
 * Hook to get current admin user's permissions
 */
export const usePermissions = () => {
  return useQuery({
    queryKey: ['adminPermissions'],
    queryFn: fetchPermissions,
    staleTime: 0, // Always refetch on mount to ensure fresh data
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnMount: true, // Refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });
};

/**
 * Hook to check if user has a specific permission
 */
export const useHasPermission = (permission) => {
  const { data, isLoading } = usePermissions();
  
  if (isLoading || !data) {
    return false;
  }
  
  return data.permissions?.includes(permission) || false;
};

/**
 * Hook to check if user has any of the specified permissions
 */
export const useHasAnyPermission = (permissions) => {
  const { data, isLoading } = usePermissions();
  
  if (isLoading || !data) {
    return false;
  }
  
  return permissions.some(permission => 
    data.permissions?.includes(permission)
  );
};

/**
 * Hook to check if user has all of the specified permissions
 */
export const useHasAllPermissions = (permissions) => {
  const { data, isLoading } = usePermissions();
  
  if (isLoading || !data) {
    return false;
  }
  
  return permissions.every(permission => 
    data.permissions?.includes(permission)
  );
};

/**
 * Hook to get the current admin role
 */
export const useAdminRole = () => {
  const { data, isLoading } = usePermissions();
  
  return {
    adminRole: data?.adminRole,
    isLoading,
    isSuperAdmin: data?.adminRole === 'super_admin',
    isAdmin: data?.adminRole === 'admin',
    isModerator: data?.adminRole === 'moderator',
  };
};
