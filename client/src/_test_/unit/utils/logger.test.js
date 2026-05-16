import logger from '@/utils/logger';

// Mock import.meta.env for this test file
const mockImportMeta = {
  env: {
    DEV: true,
    MODE: 'test',
  }
};

// Override import.meta if it exists
if (typeof global.import !== 'undefined' && global.import.meta) {
  Object.assign(global.import.meta.env, mockImportMeta.env);
}

describe('logger', () => {
  let originalEnv;
  let consoleSpy;

  beforeEach(() => {
    // Access via global mock
    originalEnv = global.__VITE_IMPORT_META_ENV__?.DEV ?? true;
    if (global.__VITE_IMPORT_META_ENV__) {
      global.__VITE_IMPORT_META_ENV__.DEV = true;
    }
    consoleSpy = {
      log: jest.spyOn(console, 'log').mockImplementation(),
      info: jest.spyOn(console, 'info').mockImplementation(),
      warn: jest.spyOn(console, 'warn').mockImplementation(),
      error: jest.spyOn(console, 'error').mockImplementation(),
      group: jest.spyOn(console, 'group').mockImplementation(),
      groupEnd: jest.spyOn(console, 'groupEnd').mockImplementation(),
      table: jest.spyOn(console, 'table').mockImplementation(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
    if (global.__VITE_IMPORT_META_ENV__) {
      global.__VITE_IMPORT_META_ENV__.DEV = originalEnv;
    }
  });

  describe('debug', () => {
    it('should log in development mode', () => {
      if (global.__VITE_IMPORT_META_ENV__) {
        global.__VITE_IMPORT_META_ENV__.DEV = true;
      }
      logger.debug('test message');
      expect(consoleSpy.log).toHaveBeenCalled();
    });

    it('should not log in production mode', () => {
      // Clear previous calls
      consoleSpy.log.mockClear();
      // Set DEV to false explicitly
      if (global.__VITE_IMPORT_META_ENV__) {
        global.__VITE_IMPORT_META_ENV__.DEV = false;
      }
      // Re-import logger to get fresh instance with updated DEV value
      jest.resetModules();
      const freshLogger = require('@/utils/logger').default;
      freshLogger.debug('test message');
      expect(consoleSpy.log).not.toHaveBeenCalled();
      // Restore DEV
      if (global.__VITE_IMPORT_META_ENV__) {
        global.__VITE_IMPORT_META_ENV__.DEV = true;
      }
    });
  });

  describe('info', () => {
    it('should log in development mode', () => {
      if (global.__VITE_IMPORT_META_ENV__) {
        global.__VITE_IMPORT_META_ENV__.DEV = true;
      }
      logger.info('test message');
      expect(consoleSpy.info).toHaveBeenCalled();
    });
  });

  describe('warn', () => {
    it('should always log warnings', () => {
      if (global.__VITE_IMPORT_META_ENV__) {
        global.__VITE_IMPORT_META_ENV__.DEV = false;
      }
      logger.warn('test warning');
      expect(consoleSpy.warn).toHaveBeenCalled();
    });
  });

  describe('error', () => {
    it('should always log errors', () => {
      if (global.__VITE_IMPORT_META_ENV__) {
        global.__VITE_IMPORT_META_ENV__.DEV = false;
      }
      logger.error('test error');
      expect(consoleSpy.error).toHaveBeenCalled();
    });
  });

  describe('api', () => {
    it('should log API calls in development', () => {
      if (global.__VITE_IMPORT_META_ENV__) {
        global.__VITE_IMPORT_META_ENV__.DEV = true;
      }
      logger.api('/test', 'GET');
      expect(consoleSpy.log).toHaveBeenCalled();
    });
  });

  describe('group', () => {
    it('should create console group in development', () => {
      if (global.__VITE_IMPORT_META_ENV__) {
        global.__VITE_IMPORT_META_ENV__.DEV = true;
      }
      logger.group('Test Group', () => {});
      expect(consoleSpy.group).toHaveBeenCalled();
      expect(consoleSpy.groupEnd).toHaveBeenCalled();
    });
  });

  describe('table', () => {
    it('should log table in development', () => {
      if (global.__VITE_IMPORT_META_ENV__) {
        global.__VITE_IMPORT_META_ENV__.DEV = true;
      }
      logger.table({ a: 1 });
      expect(consoleSpy.table).toHaveBeenCalled();
    });
  });
});


