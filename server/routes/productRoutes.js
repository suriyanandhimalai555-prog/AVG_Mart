import { Router } from 'express';
import { createProduct, getAllProducts, updateProduct, deleteProduct } from '../controllers/productController.js';
// Pakka path and variable name matching your upload configuration setup
import { uploadFiles } from '../middleware/upload.js'; 

const router = Router();

router.get('/', getAllProducts);

// Use uploadFiles here for creating a product
router.post('/', uploadFiles.array('productImages', 5), createProduct);

// ADDED THIS: Use uploadFiles here for updating a product
router.put('/:id', uploadFiles.array('productImages', 5), updateProduct);

router.delete('/:id', deleteProduct);

export default router;