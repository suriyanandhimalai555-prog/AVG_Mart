import express from 'express';
import { createRequest, getAllRequests, updateRequestStatus } from '../controllers/stockRequestController.js';

const router = express.Router();

// Matches: POST http://localhost:5000/api/branch-stock/stock-requests
router.post('/stock-requests', createRequest);

// Matches: GET http://localhost:5000/api/branch-stock/stock-requests
router.get('/stock-requests', getAllRequests);

// Matches: PUT http://localhost:5000/api/branch-stock/stock-requests/:id/status
router.put('/stock-requests/:id/status', updateRequestStatus);

export default router;