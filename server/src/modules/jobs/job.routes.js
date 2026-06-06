import express from 'express';
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
  closeJob,
  getJobStats,
  getRecommendedJobs,
  getRecommendedFreelancers,
} from './job.controller.js';
import {
  validateCreateJob,
  validateUpdateJob,
  validateJobQuery,
} from './job.validation.js';
import { authenticate, authorize, aiRateLimit } from '../../core/middlewares/index.js';

const router = express.Router();

// Public route — no auth needed
router.get('/', validateJobQuery, getAllJobs);

router.use(authenticate);

// Specific named routes MUST come before /:id to avoid being swallowed
router.get('/client/my-jobs', authorize('client'), getMyJobs);
router.get('/client/stats', authorize('client'), getJobStats);

// Recommended jobs for freelancers — MUST be before /:id
router.get('/freelancer/recommended', authorize('freelancer'), aiRateLimit('recommendation', { skipAdmin: true }), getRecommendedJobs);

// Job CRUD
router.post('/', authorize('client'), validateCreateJob, createJob);
router.put('/:id', authorize('client'), validateUpdateJob, updateJob);
router.delete('/:id', authorize('client'), deleteJob);
router.patch('/:id/close', authorize('client'), closeJob);

// Dynamic :id routes — must come AFTER all named routes
router.get('/:id', getJobById);

// Recommended freelancers for a specific job (client only)
router.get('/:id/recommended-freelancers', authorize('client'), aiRateLimit('recommendation', { skipAdmin: true }), getRecommendedFreelancers);

export default router;
