// Mock for envConfig that uses import.meta.env
const envConfig = {
  apiUrl: process.env.VITE_API_URL || 'http://localhost:5000/api',
  apiTimeout: 30000,
  tokenKey: 'linkify_token',
  refreshTokenKey: 'linkify_refresh_token',
  googleClientId: '',
  appName: 'Linkify',
  appVersion: '1.0.0',
  environment: 'test',
  features: {
    aiMatching: false,
    payments: false,
    messaging: true,
    notifications: true,
  },
  defaultPageSize: 10,
  maxPageSize: 100,
  maxFileSize: 5 * 1024 * 1024,
  allowedFileTypes: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
  socketUrl: 'http://localhost:5000',
  jazzcashMerchantId: '',
  easypaisaMerchantId: '',
  isDevelopment: false,
  isProduction: false,
  enableDebugLogs: false,
};

export default envConfig;

