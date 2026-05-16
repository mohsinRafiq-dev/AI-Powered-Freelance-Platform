// Unit test setup
import '@testing-library/jest-dom';

// Polyfill TextEncoder/TextDecoder for Node.js environment
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock Vite's import.meta.env using a global variable
// The babel plugin will transform import.meta.env.X to global.__VITE_IMPORT_META_ENV__.X
global.__VITE_IMPORT_META_ENV__ = {
  VITE_API_URL: process.env.VITE_API_URL || 'http://localhost:5000/api',
  VITE_GOOGLE_CLIENT_ID: '',
  VITE_SOCKET_URL: 'http://localhost:5000',
  VITE_FEATURE_AI_MATCHING: 'false',
  VITE_FEATURE_PAYMENTS: 'false',
  VITE_FEATURE_MESSAGING: 'true',
  VITE_FEATURE_NOTIFICATIONS: 'true',
  VITE_ENABLE_DEBUG: 'false',
  DEV: true,
  MODE: 'test',
  PROD: false,
};

// Mock environment variables
process.env.VITE_API_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock fetch
global.fetch = jest.fn();

// Suppress console errors in tests unless needed
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
       args[0].includes('Warning: validateDOMNesting'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});


