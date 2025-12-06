import express from 'express';
import { getCenters, createCenter, updateCenterLoad } from '../controllers/centerController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getCenters)
    .post(protect, admin, createCenter);

router.route('/:id/load')
    .put(protect, admin, updateCenterLoad);

export default router;
