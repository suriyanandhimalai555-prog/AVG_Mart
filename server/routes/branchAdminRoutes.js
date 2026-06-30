import express from 'express';
import { createBranchAdmin, getAllBranchAdmins, updateBranchAdmin } from '../controllers/branchAdminController.js';

const router = express.Router();

router.post('/branch', createBranchAdmin);
router.get('/branch', getAllBranchAdmins);
router.put('/branch/:id', updateBranchAdmin);

export default router;