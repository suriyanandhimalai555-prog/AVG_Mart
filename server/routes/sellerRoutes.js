import express from 'express';
import multer from 'multer';
import { 
  registerSeller, 
  loginSeller, 
  forgotPassword,
  verifySellerOtp,
  resetPasswordWithOtp,
  getSellerDashboardData, 
  getSellerProfile,
  getAllSellers,
  getSellerReferralTree,
  updateSellerPayoutStatus, // <--- New Payout Status Update Controller
  getSellerMyPayouts        // <--- New Seller Payout Ledger View Controller
} from '../controllers/sellerController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure multer to store uploaded files in memory buffer for S3 upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Public routes
router.post('/register', upload.single('gst_document'), registerSeller);
router.post('/login', loginSeller);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifySellerOtp);
router.post('/reset-password', resetPasswordWithOtp);

// Dashboard & Profile
router.get('/dashboard-stats', verifyToken, getSellerDashboardData);
router.get('/profile', verifyToken, getSellerProfile);

// Get all sellers (Admin directory & Payout management)
router.get('/all', verifyToken, getAllSellers);
router.get('/', verifyToken, getAllSellers);

// Admin Payout Status Update Route
router.post('/payout-status', verifyToken, updateSellerPayoutStatus);

// Seller My Daily Payouts Route (For logged-in sellers to view their daily earnings & status)
router.get('/my-payouts', verifyToken, getSellerMyPayouts);

router.get('/referral-tree', verifyToken, getSellerReferralTree);

export default router;