// Mock for logger that uses import.meta.env
// Check global.__VITE_IMPORT_META_ENV__ first, then fallback to NODE_ENV
// This allows tests to control the DEV flag
// Use a function to get current isDevelopment value dynamically
const getIsDevelopment = () => {
  if (global.__VITE_IMPORT_META_ENV__ !== undefined) {
    // Explicitly check if DEV is false, otherwise default to true
    return global.__VITE_IMPORT_META_ENV__.DEV === true || 
           (global.__VITE_IMPORT_META_ENV__.DEV !== false && process.env.NODE_ENV !== 'production');
  }
  return process.env.NODE_ENV !== 'production';
};

const LogLevel = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
};

const formatMessage = (level, message, ...args) => {
  const timestamp = new Date().toISOString();
  return [`[${timestamp}] [${level}]`, message, ...args];
};

const debug = (message, ...args) => {
  if (getIsDevelopment()) {
    console.log(...formatMessage(LogLevel.DEBUG, message, ...args));
  }
};

const info = (message, ...args) => {
  if (getIsDevelopment()) {
    console.info(...formatMessage(LogLevel.INFO, message, ...args));
  }
};

const warn = (message, ...args) => {
  console.warn(...formatMessage(LogLevel.WARN, message, ...args));
};

const error = (message, ...args) => {
  console.error(...formatMessage(LogLevel.ERROR, message, ...args));
};

const api = (url, method, data) => {
  if (getIsDevelopment()) {
    console.log(`[API] ${method} ${url}`, data || '');
  }
};

const group = (label, fn) => {
  if (getIsDevelopment()) {
    console.group(label);
    try {
      fn();
    } finally {
      console.groupEnd();
    }
  } else {
    fn();
  }
};

const table = (data) => {
  if (getIsDevelopment()) {
    console.table(data);
  }
};

export default {
  debug,
  info,
  warn,
  error,
  api,
  group,
  table,
};

