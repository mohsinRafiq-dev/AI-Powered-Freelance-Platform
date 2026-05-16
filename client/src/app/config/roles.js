
export const USER_ROLES = {
  FREELANCER: 'freelancer',
  CLIENT: 'client',
  ADMIN: 'admin',
};

export const ROLE_PERMISSIONS = {
  [USER_ROLES.FREELANCER]: {
    canBrowseJobs: true,
    canSubmitProposals: true,
    canMessageClients: true,
    canReceivePayments: true,
    canManageProfile: true,
    canViewEarnings: true,
  },
  [USER_ROLES.CLIENT]: {
    canPostJobs: true,
    canReviewProposals: true,
    canMessageFreelancers: true,
    canMakePayments: true,
    canManageJobs: true,
    canViewSpending: true,
  },
  [USER_ROLES.ADMIN]: {
    canManageUsers: true,
    canManageJobs: true,
    canManagePayments: true,
    canViewAnalytics: true,
    canModerateContent: true,
    canAccessAllFeatures: true,
  },
};

export const hasPermission = (role, permission) => {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions ? permissions[permission] === true : false;
};

export const getRolePermissions = (role) => {
  return ROLE_PERMISSIONS[role] || {};
};

export const isValidRole = (role) => {
  return Object.values(USER_ROLES).includes(role);
};

export const getDashboardPath = (role) => {
  switch (role) {
    case USER_ROLES.FREELANCER:
      return '/freelancer/dashboard';
    case USER_ROLES.CLIENT:
      return '/client/dashboard';
    case USER_ROLES.ADMIN:
      return '/admin/dashboard';
    default:
      return '/';
  }
};

export default {
  USER_ROLES,
  ROLE_PERMISSIONS,
  hasPermission,
  getRolePermissions,
  isValidRole,
  getDashboardPath,
};
