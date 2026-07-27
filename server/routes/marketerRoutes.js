import express from 'express';
import { registerMarketer, loginMarketer, getMarketerProfile, getMarketerDashboard } from '../controllers/marketerController.js';
import {verifyToken }from '../middleware/authMiddleware.js'; // Adjust to your auth middleware filename

const router = express.Router();

router.post('/signup', registerMarketer);
router.post('/login', loginMarketer);
router.get('/profile', verifyToken, getMarketerProfile);
router.get('/dashboard', verifyToken, getMarketerDashboard);

export default router;