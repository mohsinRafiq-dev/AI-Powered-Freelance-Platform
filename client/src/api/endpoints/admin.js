const ADMIN_ENDPOINTS = {
  // Admin settings endpoints
  getAdminSettings: '/admin/settings',
  updateAdminSettings: '/admin/settings',
  getAIFeatureStatus: '/settings/ai-status', // Public endpoint for all users
  
  // Environment variables endpoints
  getEnvVars: '/admin/env-vars',
  getEnvVar: '/admin/env-vars', // Use with key param
  setEnvVar: '/admin/env-vars',
  deleteEnvVar: '/admin/env-vars', // Use with key param
  setBulkEnvVars: '/admin/env-vars/bulk',
  getPublicEnvVars: '/admin/env-vars/public',
};

export default ADMIN_ENDPOINTS;



