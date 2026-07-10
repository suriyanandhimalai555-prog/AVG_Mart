import { Router } from 'express';
import { 
  createCategory, 
  getAllCategories, 
  updateCategory, 
  deleteCategory 
} from '../controllers/categoryController.js';
import { uploadFiles } from '../middleware/upload.js';

const router = Router();

// Fetch all categories
router.get('/', getAllCategories);

// Create a new category with a single image upload
router.post('/', uploadFiles.single('categoryImage'), createCategory);

// Update an existing category by ID (handles image updates seamlessly)
router.put('/:id', uploadFiles.single('categoryImage'), updateCategory);

// Delete an existing category by ID
router.delete('/:id', deleteCategory);

export default router;