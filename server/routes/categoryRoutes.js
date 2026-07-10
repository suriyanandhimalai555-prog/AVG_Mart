import { Router } from 'express';
import { createCategory, getAllCategories } from '../controllers/categoryController.js';
import { uploadFiles } from '../middleware/upload.js'; // Assumed to have .single handling capabilities

const router = Router();

router.get('/', getAllCategories);
// Notice .single('categoryImage') for single image handling
router.post('/', uploadFiles.single('categoryImage'), createCategory);

export default router;