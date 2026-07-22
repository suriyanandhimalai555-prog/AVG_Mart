import express from 'express';
import { registerSeller, loginSeller, getSellerDashboardData } from '../controllers/sellerController.js';

const router = express.Router();

router.post('/register', registerSeller);
router.post('/login', loginSeller);
router.get('/dashboard-stats', getSellerDashboardData);

export default router;