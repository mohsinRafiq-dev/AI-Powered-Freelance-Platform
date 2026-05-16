import express from 'express';
import { authenticate } from '../../core/middlewares/auth.middleware.js';
import * as ctrl from './learning.controller.js';

const router = express.Router();

router.use(authenticate);

// Browse (any authenticated user)
router.get('/courses', ctrl.listCourses);
router.get('/courses/recommended', ctrl.recommendCourses);
router.get('/progress', ctrl.myProgress);
router.get('/courses/:id', ctrl.getCourse);

// Enrollment & lessons
router.post('/courses/:id/enroll', ctrl.enroll);
router.post('/courses/:id/lessons/:lessonId/complete', ctrl.markLessonComplete);

// Assessments
router.post('/courses/:id/assessment', ctrl.submitAssessment);

// Admin: course management
router.post('/courses', ctrl.createCourse);
router.patch('/courses/:id', ctrl.updateCourse);
router.delete('/courses/:id', ctrl.deleteCourse);

export default router;
