import express from 'express';
import { getStock, addOrUpdateStock, deleteStock } from '../controllers/stockController.js';

const router = express.Router();

router.get('/', getStock);
router.post('/', addOrUpdateStock);
router.delete('/:id', deleteStock);

export default router;