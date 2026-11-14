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
  getSellerReferralTree
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
// Added upload.single('gst_document') to handle multipart form-data & file upload
router.post('/register', upload.single('gst_document'), registerSeller);
router.post('/login', loginSeller);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifySellerOtp);
router.post('/reset-password', resetPasswordWithOtp);

// Dashboard & Profile
router.get('/dashboard-stats', verifyToken, getSellerDashboardData);
router.get('/profile', verifyToken, getSellerProfile);

// Get all sellers: Handle both root and empty path explicitly
router.get('/all', verifyToken, getAllSellers); // Dedicated /all subpath
router.get('/', verifyToken, getAllSellers);

router.get('/referral-tree', verifyToken, getSellerReferralTree);

export default router;