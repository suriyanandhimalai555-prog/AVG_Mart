import express from 'express';
import { registerMarketer, loginMarketer, getMarketerProfile } from '../controllers/marketerController.js';
import {verifyToken }from '../middleware/authMiddleware.js'; // Adjust to your auth middleware filename

const router = express.Router();

router.post('/signup', registerMarketer);
router.post('/login', loginMarketer);
router.get('/profile', verifyToken, getMarketerProfile);

export default router;