import { Router } from "express";
import { signup, login } from "../controllers/authController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

// profile
import { getProfile, changePassword, addAddress, editAddress, removeAddress } from "../controllers/userController.js";

// cart
import { getCart, addToCart, updateCartQuantity, removeFromCart } from "../controllers/cartController.js";

// payment
import { createRazorpayOrder, verifyRazorpayPayment, getUserOrders, getAllCustomerOrders, updateOrderStatusByAdmin } from "../controllers/paymentController.js";

const router = Router();

// Public auth endpoints
router.post("/signup", signup);
router.post("/login", login);

// Protected Profiles Actions & Controls
router.get("/profile", verifyToken, getProfile);
router.put("/profile/password", verifyToken, changePassword);
router.post("/profile/address", verifyToken, addAddress);
router.put("/profile/address/:id", verifyToken, editAddress);
router.delete("/profile/address/:id", verifyToken, removeAddress);

// Add these to your routes/authRoutes.js file under protected paths
router.get("/cart", verifyToken, getCart);
router.post("/cart", verifyToken, addToCart);
router.put("/cart/:id", verifyToken, updateCartQuantity);
router.delete("/cart/:id", verifyToken, removeFromCart);

router.post("/payment/order", verifyToken, createRazorpayOrder);
router.post("/payment/verify", verifyToken, verifyRazorpayPayment);
router.get("/orders", verifyToken, getUserOrders);
router.get("/admin/orders", verifyToken, getAllCustomerOrders); // Add your admin verification middleware here if applicable
router.put("/admin/orders/:orderId", verifyToken, updateOrderStatusByAdmin);

// Admin Dashboard Command Control Center
router.get("/admin-dashboard", verifyToken, isAdmin, (req, res) => {
  res.status(200).json({ message: "Welcome to the Admin Command Control Center." });
});

export default router;