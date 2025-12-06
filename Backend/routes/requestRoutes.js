import express from 'express';
import { createRequest, getRequests, updateRequestStatus, deleteRequest } from '../controllers/requestController.js';
import { protect, admin } from '../middleware/authMiddleware.js';


const router = express.Router();

router.route('/')
    .post(protect, createRequest)
    .get(protect, getRequests);

router.route('/:id')
    .put(protect, admin, updateRequestStatus)
    .delete(protect, deleteRequest);

export default router;
