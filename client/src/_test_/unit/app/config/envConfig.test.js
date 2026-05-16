import envConfig from '@/app/config/envConfig';

describe('envConfig', () => {
  it('should have apiUrl', () => {
    expect(envConfig.apiUrl).toBeDefined();
  });

  it('should have tokenKey', () => {
    expect(envConfig.tokenKey).toBe('linkify_token');
  });

  it('should have appName', () => {
    expect(envConfig.appName).toBe('Linkify');
  });

  it('should have features object', () => {
    expect(envConfig.features).toBeDefined();
    expect(typeof envConfig.features).toBe('object');
  });

  it('should have defaultPageSize', () => {
    expect(envConfig.defaultPageSize).toBe(10);
  });

  it('should have maxFileSize', () => {
    expect(envConfig.maxFileSize).toBe(5 * 1024 * 1024);
  });

  it('should have allowedFileTypes array', () => {
    expect(Array.isArray(envConfig.allowedFileTypes)).toBe(true);
  });

  it('should have socketUrl', () => {
    expect(envConfig.socketUrl).toBeDefined();
  });

  it('should have isDevelopment and isProduction flags', () => {
    expect(typeof envConfig.isDevelopment).toBe('boolean');
    expect(typeof envConfig.isProduction).toBe('boolean');
  });
});


