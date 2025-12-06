import express from 'express';
import { createReport, getReports, updateReportStatus } from '../controllers/reportController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createReport)
    .get(protect, getReports);

router.route('/:id')
    .put(protect, admin, updateReportStatus);

export default router;
