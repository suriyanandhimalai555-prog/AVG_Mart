import { Router } from "express";
import { signup, login } from "../controllers/authController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = Router();

// Public auth endpoints
router.post("/signup", signup);
router.post("/login", login);

// Example of a route protected for Admins only
router.get("/admin-dashboard", verifyToken, isAdmin, (req, res) => {
  res.status(200).json({ message: "Welcome to the Admin Command Control Center." });
});

export default router;