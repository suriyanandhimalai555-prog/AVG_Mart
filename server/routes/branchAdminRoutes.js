import express from 'express';
import { createBranchAdmin, getAllBranchAdmins, updateBranchAdmin } from '../controllers/branchAdminController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js'; // Assuming auth middleware is here

const router = express.Router();

// Only master admins should be allowed to create branch admins
router.post('/branch', verifyToken, isAdmin, createBranchAdmin);

// Protected routes (logic inside controllers will filter data based on role)
router.get('/branch', verifyToken, getAllBranchAdmins);
router.put('/branch/:id', verifyToken, updateBranchAdmin);

export default router;