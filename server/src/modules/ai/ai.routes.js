import express from 'express';
import { authenticate } from '../../core/middlewares/auth.middleware.js';
import asyncHandler from '../../core/utils/asyncHandler.js';
import { successResponse } from '../../core/utils/responseFormatter.js';
import aiLearningService from '../../services/ai/learning.service.js';
import { createAppError } from '../../core/errors/index.js';

const router = express.Router();

router.use(authenticate);

/**
 * POST /api/ai/feedback
 * Body: { surface, signal, prediction?, jobId?, proposalId?, contractId?, reviewId?, skills?, category?, note? }
 */
router.post(
  '/feedback',
  asyncHandler(async (req, res) => {
    const { surface, signal, prediction, jobId, proposalId, contractId, reviewId, skills, category, note } = req.body;
    if (!surface || !signal) {
      throw createAppError('surface and signal are required', 400);
    }
    const doc = await aiLearningService.logFeedback({
      userId: req.user.id,
      surface,
      signal,
      prediction,
      job: jobId,
      proposal: proposalId,
      contract: contractId,
      review: reviewId,
      skills,
      category,
      note,
    });
    successResponse(res, { feedback: doc }, 'Feedback recorded', 201);
  })
);

/**
 * GET /api/ai/insights — current learned weights (admin/debug)
 */
router.get(
  '/insights',
  asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin') {
      throw createAppError('Admin only', 403);
    }
    const insights = await aiLearningService.getInsights();
    successResponse(res, { insights }, 'AI learning insights');
  })
);

/**
 * POST /api/ai/rebuild — force a weight rebuild (admin)
 */
router.post(
  '/rebuild',
  asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin') {
      throw createAppError('Admin only', 403);
    }
    const result = await aiLearningService.rebuildWeights();
    successResponse(res, { result }, 'AI weights rebuilt');
  })
);

export default router;
