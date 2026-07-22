import express from 'express';
import { 
  registerSeller, 
  loginSeller, 
  getSellerDashboardData, 
  getSellerProfile 
} from '../controllers/sellerController.js';
import { verifyToken } from '../middleware/authMiddleware.js'; // Ensure correct path to middleware

const router = express.Router();

router.post('/register', registerSeller);
router.post('/login', loginSeller);

// ADD verifyToken HERE
router.get('/dashboard-stats', verifyToken, getSellerDashboardData);
router.get('/profile', verifyToken, getSellerProfile);

export default router;