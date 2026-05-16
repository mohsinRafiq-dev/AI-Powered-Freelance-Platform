import { useHasPermission, useHasAnyPermission, useHasAllPermissions, useAdminRole } from '../../hooks/admin/usePermissions';

/**
 * Component to conditionally render children based on permission
 * @param {string} permission - Required permission
 * @param {React.ReactNode} children - Content to render if permission granted
 * @param {React.ReactNode} fallback - Content to render if permission denied (optional)
 */
export const HasPermission = ({ permission, children, fallback = null }) => {
  const hasPermission = useHasPermission(permission);
  
  return hasPermission ? children : fallback;
};

/**
 * Component to render children if user has ANY of the specified permissions
 */
export const HasAnyPermission = ({ permissions, children, fallback = null }) => {
  const hasPermission = useHasAnyPermission(permissions);
  
  return hasPermission ? children : fallback;
};

/**
 * Component to render children if user has ALL of the specified permissions
 */
export const HasAllPermissions = ({ permissions, children, fallback = null }) => {
  const hasPermission = useHasAllPermissions(permissions);
  
  return hasPermission ? children : fallback;
};

/**
 * Component to render children based on admin role
 */
export const HasAdminRole = ({ roles, children, fallback = null }) => {
  const { adminRole } = useAdminRole();
  
  const hasRole = Array.isArray(roles) 
    ? roles.includes(adminRole) 
    : roles === adminRole;
  
  return hasRole ? children : fallback;
};
