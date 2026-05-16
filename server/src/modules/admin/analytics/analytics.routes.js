import express from 'express';
import { authenticate, authorize } from '../../../core/middlewares/index.js';
import { requirePermission } from '../../../core/middlewares/permissions.js';
import { PERMISSIONS } from '../../../config/permissions.js';
import * as analyticsController from './analytics.controller.js';
import forecastService from './forecast.service.js';
import asyncHandler from '../../../core/utils/asyncHandler.js';
import { successResponse } from '../../../core/utils/responseFormatter.js';

const router = express.Router();

// All routes require admin authentication
router.use(authenticate);
router.use(authorize('admin'));

/**
 * @route   GET /api/admin/analytics/dashboard
 * @desc    Get dashboard metrics
 * @access  Admin (Moderator can view)
 */
router.get('/dashboard', requirePermission(PERMISSIONS.VIEW_ANALYTICS), analyticsController.getDashboardMetrics);

/**
 * @route   GET /api/admin/analytics/user-growth
 * @desc    Get user growth report
 * @access  Admin (Moderator can view)
 */
router.get('/user-growth', requirePermission(PERMISSIONS.VIEW_ANALYTICS), analyticsController.getUserGrowthReport);

/**
 * @route   GET /api/admin/analytics/revenue
 * @desc    Get revenue report
 * @access  Admin (Admin and above)
 */
router.get('/revenue', requirePermission(PERMISSIONS.VIEW_ADVANCED_ANALYTICS), analyticsController.getRevenueReport);

/**
 * @route   GET /api/admin/analytics/categories
 * @desc    Get category distribution
 * @access  Admin (Moderator can view)
 */
router.get('/categories', requirePermission(PERMISSIONS.VIEW_ANALYTICS), analyticsController.getCategoryDistribution);

/**
 * @route   GET /api/admin/analytics/flagged-jobs
 * @desc    Get flagged jobs report
 * @access  Admin (Moderator can view)
 */
router.get('/flagged-jobs', requirePermission(PERMISSIONS.VIEW_ANALYTICS), analyticsController.getFlaggedJobsReport);

/**
 * @route   GET /api/admin/analytics/export/pdf
 * @desc    Export analytics to PDF
 * @access  Admin (Admin and above)
 */
router.get('/export/pdf', requirePermission(PERMISSIONS.EXPORT_ANALYTICS), analyticsController.exportToPDF);

/**
 * @route   GET /api/admin/analytics/export/excel
 * @desc    Export analytics to Excel
 * @access  Admin (Admin and above)
 */
router.get('/export/excel', requirePermission(PERMISSIONS.EXPORT_ANALYTICS), analyticsController.exportToExcel);

/**
 * @route   GET /api/admin/analytics/export/csv
 * @desc    Export analytics to CSV
 * @access  Admin (Admin and above)
 */
router.get('/export/csv', requirePermission(PERMISSIONS.EXPORT_ANALYTICS), analyticsController.exportToCSV);

/**
 * Forecasting endpoints — linear-regression-based trend prediction
 */
router.get(
  '/forecast/users',
  requirePermission(PERMISSIONS.VIEW_ANALYTICS),
  asyncHandler(async (req, res) => {
    const horizon = parseInt(req.query.horizon || '14', 10);
    const lookback = parseInt(req.query.lookback || '60', 10);
    const result = await forecastService.forecastUserGrowth({ horizonDays: horizon, lookbackDays: lookback });
    successResponse(res, { forecast: result }, 'User growth forecast');
  })
);

router.get(
  '/forecast/revenue',
  requirePermission(PERMISSIONS.VIEW_ADVANCED_ANALYTICS),
  asyncHandler(async (req, res) => {
    const horizon = parseInt(req.query.horizon || '14', 10);
    const lookback = parseInt(req.query.lookback || '60', 10);
    const result = await forecastService.forecastRevenue({ horizonDays: horizon, lookbackDays: lookback });
    successResponse(res, { forecast: result }, 'Revenue forecast');
  })
);

router.get(
  '/forecast/jobs',
  requirePermission(PERMISSIONS.VIEW_ANALYTICS),
  asyncHandler(async (req, res) => {
    const horizon = parseInt(req.query.horizon || '14', 10);
    const lookback = parseInt(req.query.lookback || '60', 10);
    const result = await forecastService.forecastJobPostings({ horizonDays: horizon, lookbackDays: lookback });
    successResponse(res, { forecast: result }, 'Job postings forecast');
  })
);

router.get(
  '/skill-demand',
  requirePermission(PERMISSIONS.VIEW_ANALYTICS),
  asyncHandler(async (req, res) => {
    const lookback = parseInt(req.query.lookback || '90', 10);
    const topN = parseInt(req.query.top || '15', 10);
    const trends = await forecastService.skillDemandTrends({ lookbackDays: lookback, topN });
    successResponse(res, { trends }, 'Skill demand trends');
  })
);

export default router;
