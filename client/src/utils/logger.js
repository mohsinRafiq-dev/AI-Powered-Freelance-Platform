
const isDevelopment = import.meta.env.DEV;

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
  if (isDevelopment) {
    console.log(...formatMessage(LogLevel.DEBUG, message, ...args));
  }
};

const info = (message, ...args) => {
  if (isDevelopment) {
    console.info(...formatMessage(LogLevel.INFO, message, ...args));
  }
};

const warn = (message, ...args) => {
  console.warn(...formatMessage(LogLevel.WARN, message, ...args));
};

const error = (message, ...args) => {
  console.error(...formatMessage(LogLevel.ERROR, message, ...args));
};

const api = (endpoint, method = 'GET', data = null) => {
  if (isDevelopment) {
    const emoji = method === 'GET' ? '📡' : method === 'POST' ? '📤' : method === 'PUT' ? '✏️' : '🗑️';
    console.log(`${emoji} API: ${method} ${endpoint}`, data || '');
  }
};

const group = (label, callback) => {
  if (isDevelopment) {
    console.group(label);
    callback();
    console.groupEnd();
  }
};

const table = (data) => {
  if (isDevelopment) {
    console.table(data);
  }
};

const logger = {
  debug,
  info,
  warn,
  error,
  api,
  group,
  table,
};

export default logger;
export { LogLevel };
