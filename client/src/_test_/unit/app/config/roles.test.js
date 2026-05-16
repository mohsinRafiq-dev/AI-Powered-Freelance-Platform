import {
  USER_ROLES,
  ROLE_PERMISSIONS,
  hasPermission,
  getRolePermissions,
  isValidRole,
  getDashboardPath,
} from '@/app/config/roles';

describe('roles', () => {
  describe('USER_ROLES', () => {
    it('should have correct role constants', () => {
      expect(USER_ROLES.FREELANCER).toBe('freelancer');
      expect(USER_ROLES.CLIENT).toBe('client');
      expect(USER_ROLES.ADMIN).toBe('admin');
    });
  });

  describe('hasPermission', () => {
    it('should return true for valid permission', () => {
      expect(hasPermission(USER_ROLES.FREELANCER, 'canBrowseJobs')).toBe(true);
      expect(hasPermission(USER_ROLES.CLIENT, 'canPostJobs')).toBe(true);
      expect(hasPermission(USER_ROLES.ADMIN, 'canManageUsers')).toBe(true);
    });

    it('should return false for invalid permission', () => {
      expect(hasPermission(USER_ROLES.FREELANCER, 'canPostJobs')).toBe(false);
      expect(hasPermission(USER_ROLES.CLIENT, 'canBrowseJobs')).toBe(false);
    });

    it('should return false for invalid role', () => {
      expect(hasPermission('invalid', 'canBrowseJobs')).toBe(false);
    });
  });

  describe('getRolePermissions', () => {
    it('should return permissions for valid role', () => {
      const permissions = getRolePermissions(USER_ROLES.FREELANCER);
      expect(permissions.canBrowseJobs).toBe(true);
      expect(permissions.canSubmitProposals).toBe(true);
    });

    it('should return empty object for invalid role', () => {
      expect(getRolePermissions('invalid')).toEqual({});
    });
  });

  describe('isValidRole', () => {
    it('should validate roles', () => {
      expect(isValidRole(USER_ROLES.FREELANCER)).toBe(true);
      expect(isValidRole(USER_ROLES.CLIENT)).toBe(true);
      expect(isValidRole(USER_ROLES.ADMIN)).toBe(true);
      expect(isValidRole('invalid')).toBe(false);
    });
  });

  describe('getDashboardPath', () => {
    it('should return correct dashboard path for each role', () => {
      expect(getDashboardPath(USER_ROLES.FREELANCER)).toBe('/freelancer/dashboard');
      expect(getDashboardPath(USER_ROLES.CLIENT)).toBe('/client/dashboard');
      expect(getDashboardPath(USER_ROLES.ADMIN)).toBe('/admin/dashboard');
      expect(getDashboardPath('invalid')).toBe('/');
    });
  });
});


