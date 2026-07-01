import express from 'express';
import { getStock, addOrUpdateStock, deleteStock } from '../controllers/stockController.js';
import { verifyToken } from '../middleware/authMiddleware.js'; // 👈 Import auth middleware

const router = express.Router();

router.get('/', verifyToken, getStock);
router.post('/', verifyToken, addOrUpdateStock);
router.delete('/:id', verifyToken, deleteStock);

export default router;