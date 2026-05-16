import express from 'express';
import { createReview, getUserReviews, getContractReviews, reportReview, getReviewsForModeration, moderateReview } from './review.controller.js';
import { authenticate } from '../../core/middlewares/index.js';

const router = express.Router();

// Get reviews for a user (publicly accessible, but filtered if not admin)
router.get('/user/:userId', getUserReviews);

// Protected routes
router.use(authenticate);

// Admin Moderation
router.get('/moderation', getReviewsForModeration);
router.post('/:reviewId/moderate', moderateReview);

// Get reviews for a contract
router.get('/contract/:contractId', getContractReviews);

// Create a new review
router.post('/', createReview);

// Report an unfair review
router.post('/:reviewId/report', reportReview);

export default router;
