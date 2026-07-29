// routes/appSettingRoutes.js
import express from 'express';
import { getSettings, updateSettings } from '../controllers/appSettingController.js';

const router = express.Router();

router.get('/', getSettings);
router.put('/', updateSettings);

export default router;