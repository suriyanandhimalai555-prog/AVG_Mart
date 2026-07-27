import express from 'express';
import { 
  registerSeller, 
  loginSeller, 
  getSellerDashboardData, 
  getSellerProfile,
  getAllSellers
} from '../controllers/sellerController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerSeller);
router.post('/login', loginSeller);

// Dashboard & Profile
router.get('/dashboard-stats', verifyToken, getSellerDashboardData);
router.get('/profile', verifyToken, getSellerProfile);

// Get all sellers: Handle both root and empty path explicitly
router.get('/all', verifyToken, getAllSellers); // Added dedicated /all subpath
router.get('/', verifyToken, getAllSellers);

export default router;