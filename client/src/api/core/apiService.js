
import axiosInstance from '../axiosInstance';
import logger from '@/utils/logger';

const handleError = (error, endpoint = '') => {
  // Network error
  if (!error.response) {
    logger.error(`Network Error on ${endpoint}:`, error.message);
    return {
      success: false,
      error: 'Network error. Please check your internet connection.',
      status: 0,
    };
  }

  // HTTP error
  const { status, data } = error.response;
  const message = data?.error || data?.message || error.message || 'An error occurred';

  // Don't log 401 errors for /auth/me (expected when not logged in)
  if (!(status === 401 && endpoint.includes('/auth/me'))) {
    logger.error(`API Error [${status}] on ${endpoint}:`, message);
  }

  return {
    success: false,
    error: message,
    status,
    details: data?.details || null,
  };
};

const get = async (endpoint, params = {}, config = {}) => {
  try {
    logger.api(endpoint, 'GET', params);
    const { data } = await axiosInstance.get(endpoint, { params, ...config });
    return { success: true, data: data.data || data };
  } catch (error) {
    return handleError(error, endpoint);
  }
};

const post = async (endpoint, body = {}, config = {}) => {
  try {
    logger.api(endpoint, 'POST', body);
    const { data } = await axiosInstance.post(endpoint, body, config);
    return { success: true, data: data.data || data };
  } catch (error) {
    return handleError(error, endpoint);
  }
};

const put = async (endpoint, body = {}, config = {}) => {
  try {
    logger.api(endpoint, 'PUT', body);
    const { data } = await axiosInstance.put(endpoint, body, config);
    return { success: true, data: data.data || data };
  } catch (error) {
    return handleError(error, endpoint);
  }
};

const patch = async (endpoint, body = {}, config = {}) => {
  try {
    logger.api(endpoint, 'PATCH', body);
    const { data } = await axiosInstance.patch(endpoint, body, config);
    return { success: true, data: data.data || data };
  } catch (error) {
    return handleError(error, endpoint);
  }
};

const deleteRequest = async (endpoint, config = {}) => {
  try {
    logger.api(endpoint, 'DELETE');
    const { data } = await axiosInstance.delete(endpoint, config);
    return { success: true, data: data.data || data };
  } catch (error) {
    return handleError(error, endpoint);
  }
};

const upload = async (endpoint, formData, onProgress = null) => {
  try {
    logger.api(endpoint, 'POST', 'FormData with files');
    
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
    };

    if (onProgress) {
      config.onUploadProgress = (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      };
    }

    const { data } = await axiosInstance.post(endpoint, formData, config);
    return { success: true, data: data.data || data };
  } catch (error) {
    return handleError(error, endpoint);
  }
};

const download = async (endpoint, filename) => {
  try {
    logger.api(endpoint, 'GET', 'Download');
    const { data } = await axiosInstance.get(endpoint, { responseType: 'blob' });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    return handleError(error, endpoint);
  }
};

const apiService = {
  get,
  post,
  put,
  patch,
  delete: deleteRequest,
  upload,
  download,
  handleError,
};

export default apiService;
