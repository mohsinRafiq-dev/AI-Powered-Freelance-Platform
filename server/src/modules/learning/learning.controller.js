import asyncHandler from '../../core/utils/asyncHandler.js';
import { successResponse } from '../../core/utils/responseFormatter.js';
import learningService from './learning.service.js';
import { createAppError } from '../../core/errors/index.js';

// ---- Admin: course management ----
export const createCourse = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') throw createAppError('Admin only', 403);
  const course = await learningService.createCourse(req.user.id, req.body);
  successResponse(res, { course }, 'Course created', 201);
});

export const updateCourse = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') throw createAppError('Admin only', 403);
  const course = await learningService.updateCourse(req.params.id, req.body);
  successResponse(res, { course }, 'Course updated');
});

export const deleteCourse = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') throw createAppError('Admin only', 403);
  const course = await learningService.deleteCourse(req.params.id);
  successResponse(res, { course }, 'Course deleted');
});

// ---- Browse & view ----
export const listCourses = asyncHandler(async (req, res) => {
  const result = await learningService.listCourses(req.query);
  successResponse(res, result, 'Courses fetched');
});

export const getCourse = asyncHandler(async (req, res) => {
  const course = await learningService.getCourse(req.params.id, req.user?.id);
  successResponse(res, { course }, 'Course fetched');
});

// ---- Enrollment & progress ----
export const enroll = asyncHandler(async (req, res) => {
  const enrollment = await learningService.enroll(req.user.id, req.params.id);
  successResponse(res, { enrollment }, 'Enrolled', 201);
});

export const markLessonComplete = asyncHandler(async (req, res) => {
  const enrollment = await learningService.markLessonComplete(
    req.user.id,
    req.params.id,
    req.params.lessonId
  );
  successResponse(res, { enrollment }, 'Lesson marked complete');
});

// ---- Auto-graded assessment ----
export const submitAssessment = asyncHandler(async (req, res) => {
  const result = await learningService.submitAssessment(
    req.user.id,
    req.params.id,
    req.body.answers
  );
  successResponse(res, result, result.passed ? 'Assessment passed!' : 'Assessment submitted');
});

// ---- Recommendations ----
export const recommendCourses = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit || '6', 10);
  const courses = await learningService.recommendCourses(req.user.id, limit);
  successResponse(res, { courses }, 'Recommended courses');
});

// ---- Progress tracking ----
export const myProgress = asyncHandler(async (req, res) => {
  const progress = await learningService.myProgress(req.user.id);
  successResponse(res, progress, 'My learning progress');
});
