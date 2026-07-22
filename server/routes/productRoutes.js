// import { Router } from 'express';
// import { createProduct, getAllProducts, updateProduct, deleteProduct } from '../controllers/productController.js';
// import { addProductReview, getProductReviews } from "../controllers/reviewController.js";
// import { verifyToken } from "../middleware/authMiddleware.js";
// import { uploadFiles } from '../middleware/upload.js'; 

// const router = Router();

// // Standard Product Catalogs
// router.get('/', getAllProducts);
// router.post('/', uploadFiles.array('productImages', 15), createProduct);
// router.put('/:id', uploadFiles.array('productImages', 15), updateProduct);
// router.delete('/:id', deleteProduct);

// // Review Management (Structured beautifully under /api/products)
// router.get('/:productId/reviews', getProductReviews);
// router.post('/reviews', verifyToken, uploadFiles.array('reviewImages', 15), addProductReview);

// export default router;

import { Router } from 'express';
import { createProduct, getAllProducts, updateProduct, deleteProduct } from '../controllers/productController.js';
import { addProductReview, getProductReviews } from "../controllers/reviewController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { uploadFiles } from '../middleware/upload.js'; 

const router = Router();

// Standard Product Catalogs
router.get('/', getAllProducts);

// ATTACH verifyToken HERE so req.user exists in createProduct & updateProduct
router.post('/', verifyToken, uploadFiles.array('productImages', 15), createProduct);
router.put('/:id', verifyToken, uploadFiles.array('productImages', 15), updateProduct);
router.delete('/:id', verifyToken, deleteProduct);

// Review Management
router.get('/:productId/reviews', getProductReviews);
router.post('/reviews', verifyToken, uploadFiles.array('reviewImages', 15), addProductReview);

export default router;