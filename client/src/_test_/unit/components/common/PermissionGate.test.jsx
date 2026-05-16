import { render, screen } from '@testing-library/react';
import { HasPermission, HasAnyPermission, HasAllPermissions, HasAdminRole } from '@/components/common/PermissionGate';

jest.mock('@/hooks/admin/usePermissions', () => ({
  useHasPermission: jest.fn(),
  useHasAnyPermission: jest.fn(),
  useHasAllPermissions: jest.fn(),
  useAdminRole: jest.fn(),
}));

import { useHasPermission, useHasAnyPermission, useHasAllPermissions, useAdminRole } from '@/hooks/admin/usePermissions';

describe('PermissionGate Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('HasPermission', () => {
    it('should render children when user has permission', () => {
      useHasPermission.mockReturnValue(true);

      render(
        <HasPermission permission="view_jobs">
          <div>Protected Content</div>
        </HasPermission>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('should not render children when user lacks permission', () => {
      useHasPermission.mockReturnValue(false);

      render(
        <HasPermission permission="view_jobs">
          <div>Protected Content</div>
        </HasPermission>
      );

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should render fallback when provided', () => {
      useHasPermission.mockReturnValue(false);

      render(
        <HasPermission permission="view_jobs" fallback={<div>No Access</div>}>
          <div>Protected Content</div>
        </HasPermission>
      );

      expect(screen.getByText('No Access')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });

  describe('HasAnyPermission', () => {
    it('should render children when user has any permission', () => {
      useHasAnyPermission.mockReturnValue(true);

      render(
        <HasAnyPermission permissions={['view_jobs', 'manage_jobs']}>
          <div>Content</div>
        </HasAnyPermission>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('HasAllPermissions', () => {
    it('should render children when user has all permissions', () => {
      useHasAllPermissions.mockReturnValue(true);

      render(
        <HasAllPermissions permissions={['view_jobs', 'manage_jobs']}>
          <div>Content</div>
        </HasAllPermissions>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('HasAdminRole', () => {
    it('should render children when user has admin role', () => {
      useAdminRole.mockReturnValue({ adminRole: 'admin' });

      render(
        <HasAdminRole roles="admin">
          <div>Admin Content</div>
        </HasAdminRole>
      );

      expect(screen.getByText('Admin Content')).toBeInTheDocument();
    });
  });
});

