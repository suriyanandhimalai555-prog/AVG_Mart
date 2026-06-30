import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from './routes/productRoutes.js';
import branchAdminRoutes from './routes/branchAdminRoutes.js';
import requeststockRoutes from './routes/requestStockRoutes.js'; // Import clean module

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Main Routing mount
app.use("/api/auth", authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth/admin', branchAdminRoutes);

// Fix: Mount cleanly onto a base stock prefix path
app.use('/api/branch-stock', requeststockRoutes);

// Root path test
app.get("/", (req, res) => {
  res.send("Server running cleanly.");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server executing live on port: ${PORT}`);
});