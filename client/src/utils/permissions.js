// Frontend Permission Constants (mirrors backend)

export const PERMISSIONS = {
  // User Management
  VIEW_USERS: 'view_users',
  MANAGE_USERS: 'manage_users',
  DELETE_USERS: 'delete_users',
  
  // CNIC Verification
  VIEW_CNIC: 'view_cnic',
  VERIFY_CNIC: 'verify_cnic',
  REJECT_CNIC: 'reject_cnic',
  
  // Job Management
  VIEW_JOBS: 'view_jobs',
  MANAGE_JOBS: 'manage_jobs',
  DELETE_JOBS: 'delete_jobs',
  
  // Proposal Management
  VIEW_PROPOSALS: 'view_proposals',
  MANAGE_PROPOSALS: 'manage_proposals',
  DELETE_PROPOSALS: 'delete_proposals',
  
  // Analytics
  VIEW_ANALYTICS: 'view_analytics',
  VIEW_ADVANCED_ANALYTICS: 'view_advanced_analytics',
  EXPORT_ANALYTICS: 'export_analytics',
  
  // Audit Logs
  VIEW_AUDIT_LOGS: 'view_audit_logs',
  MANAGE_AUDIT_LOGS: 'manage_audit_logs',
  
  // System Settings
  VIEW_SETTINGS: 'view_settings',
  MANAGE_SETTINGS: 'manage_settings',
  
  // Admin Management
  VIEW_ADMINS: 'view_admins',
  MANAGE_ADMINS: 'manage_admins',
  DELETE_ADMINS: 'delete_admins',
};

export const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
};

export const ADMIN_ROLE_LABELS = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  moderator: 'Moderator',
};
