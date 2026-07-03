import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from './routes/productRoutes.js';
import branchAdminRoutes from './routes/branchAdminRoutes.js';
import stockRoutes from './routes/stockRoutes.js';             // 👈 Actual Stock Management
import requeststockRoutes from './routes/requestStockRoutes.js'; // 👈 Stock Requests Management

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Main Routing mount
app.use("/api/auth", authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth/admin', branchAdminRoutes);

// PAKKA ROUTING SEPARATION FIX
app.use('/api/branch-stock', stockRoutes);                    // 👈 Handles get, add, update, delete stock entries
app.use('/api/stock-requests', requeststockRoutes);            // 👈 Handles request allocations cleanly

// Root path test
app.get("/", (req, res) => {
  res.send("Server running cleanly.");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server executing live on port: ${PORT}`);
});