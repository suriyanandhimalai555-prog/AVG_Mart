import express from 'express';
import { createRequest, getAllRequests, updateRequestStatus } from '../controllers/stockRequestController.js';
import { verifyToken } from '../middleware/authMiddleware.js'; // 👈 Import auth middleware

const router = express.Router();

// Apply verifyToken middleware to secure all resource access channels
router.post('/stock-requests', verifyToken, createRequest);
router.get('/stock-requests', verifyToken, getAllRequests);
router.put('/stock-requests/:id/status', verifyToken, updateRequestStatus);

export default router;