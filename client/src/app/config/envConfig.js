const envConfig = {
  // API Configuration
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  apiTimeout: 30000, // 30 seconds
  
  // Authentication
  tokenKey: 'linkify_token',
  refreshTokenKey: 'linkify_refresh_token',
  
  // Google OAuth
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  
  // Application
  appName: 'Linkify',
  appVersion: '1.0.0',
  environment: import.meta.env.MODE || 'development',
  
  // Feature Flags
  features: {
    aiMatching: import.meta.env.VITE_FEATURE_AI_MATCHING === 'true',
    payments: import.meta.env.VITE_FEATURE_PAYMENTS !== 'false', // Default to enabled unless explicitly disabled
    messaging: import.meta.env.VITE_FEATURE_MESSAGING !== 'false', // Default to enabled unless explicitly disabled
    notifications: import.meta.env.VITE_FEATURE_NOTIFICATIONS !== 'false', // Default to enabled unless explicitly disabled
  },
  
  // Pagination
  defaultPageSize: 10,
  maxPageSize: 100,
  
  // File Upload
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedFileTypes: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
  
  // Socket.io
  socketUrl: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
  
  // Payment Gateways
  jazzcashMerchantId: import.meta.env.VITE_JAZZCASH_MERCHANT_ID || '',
  easypaisaMerchantId: import.meta.env.VITE_EASYPAISA_MERCHANT_ID || '',
  
  // Development
  isDevelopment: import.meta.env.MODE === 'development',
  isProduction: import.meta.env.MODE === 'production',
  
  // Logging
  enableDebugLogs: import.meta.env.VITE_ENABLE_DEBUG === 'true',
};

export default envConfig;
