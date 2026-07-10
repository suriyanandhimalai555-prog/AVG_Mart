import { Router } from 'express';
import { createProduct, getAllProducts, updateProduct, deleteProduct } from '../controllers/productController.js';
import { addProductReview, getProductReviews } from "../controllers/reviewController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { uploadFiles } from '../middleware/upload.js'; 

const router = Router();

// Standard Product Catalogs
router.get('/', getAllProducts);
router.post('/', uploadFiles.array('productImages', 5), createProduct);
router.put('/:id', uploadFiles.array('productImages', 5), updateProduct);
router.delete('/:id', deleteProduct);

// Review Management (Structured beautifully under /api/products)
router.get('/:productId/reviews', getProductReviews);
router.post('/reviews', verifyToken, uploadFiles.array('reviewImages', 5), addProductReview);

export default router;