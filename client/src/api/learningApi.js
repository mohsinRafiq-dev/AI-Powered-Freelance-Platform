import axiosInstance from './axiosInstance';

const BASE = '/learning';

export const listCourses = async (params = {}) => {
  const res = await axiosInstance.get(`${BASE}/courses`, { params });
  return res.data;
};

export const getCourse = async (id) => {
  const res = await axiosInstance.get(`${BASE}/courses/${id}`);
  return res.data;
};

export const recommendedCourses = async (limit = 6) => {
  const res = await axiosInstance.get(`${BASE}/courses/recommended`, { params: { limit } });
  return res.data;
};

export const enrollInCourse = async (id) => {
  const res = await axiosInstance.post(`${BASE}/courses/${id}/enroll`);
  return res.data;
};

export const markLessonComplete = async (courseId, lessonId) => {
  const res = await axiosInstance.post(`${BASE}/courses/${courseId}/lessons/${lessonId}/complete`);
  return res.data;
};

export const submitAssessment = async (courseId, answers) => {
  const res = await axiosInstance.post(`${BASE}/courses/${courseId}/assessment`, { answers });
  return res.data;
};

export const getMyProgress = async () => {
  const res = await axiosInstance.get(`${BASE}/progress`);
  return res.data;
};

// Admin
export const createCourse = async (data) => {
  const res = await axiosInstance.post(`${BASE}/courses`, data);
  return res.data;
};

export const updateCourse = async (id, data) => {
  const res = await axiosInstance.patch(`${BASE}/courses/${id}`, data);
  return res.data;
};

export const deleteCourse = async (id) => {
  const res = await axiosInstance.delete(`${BASE}/courses/${id}`);
  return res.data;
};
