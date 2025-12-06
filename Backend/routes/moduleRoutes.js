import express from 'express';
import { getModules, completeModule } from '../controllers/moduleController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getModules);

router.route('/:id/complete')
    .post(protect, completeModule);

export default router;
