/**
 * Build an absolute URL for a file stored on the API server (uploads).
 *
 * Stored paths look like "/uploads/cnic/cnic-123-processed.jpg". We route them
 * through the API base (which already includes the "/api" prefix) so they resolve
 * in production where only "/api" is proxied to Node (e.g. Nginx on AWS). The
 * backend serves these files at both "/uploads" and "/api/uploads".
 *
 * @param {string} filePath - Relative upload path (may or may not start with "/").
 * @returns {string|null} Absolute URL, or null if no path was given.
 */
export const getUploadUrl = (filePath) => {
  if (!filePath) return null;

  // Already an absolute URL (e.g. external avatar) — return as-is.
  if (/^https?:\/\//i.test(filePath)) return filePath;

  // Normalize Windows backslashes, and if we were given an absolute filesystem
  // path (older records stored file.path), strip everything before /uploads/.
  let path = String(filePath).replace(/\\/g, '/');
  const idx = path.indexOf('/uploads/');
  if (idx !== -1) {
    path = path.slice(idx);
  } else if (!path.startsWith('/')) {
    path = `/${path}`;
  }

  // API base includes the "/api" prefix, e.g. "https://host/api".
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const base = apiBase.replace(/\/$/, '');

  return `${base}${path}`;
};

export default getUploadUrl;
