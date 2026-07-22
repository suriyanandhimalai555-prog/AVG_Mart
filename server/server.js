import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import branchAdminRoutes from './routes/branchAdminRoutes.js';
import stockRoutes from './routes/stockRoutes.js';             // 👈 Actual Stock Management
import requeststockRoutes from './routes/requestStockRoutes.js'; // 👈 Stock Requests Management
import sellerRoutes from './routes/sellerRoutes.js';

dotenv.config();

const app = express();

// 1. UPDATE CORS: Allow both production and local domains explicitly
const allowedOrigins = [
  process.env.FRONTEND_URL, 
  'https://avgmart.com', 
  'http://localhost:5173'
].filter(Boolean); // Removes undefined values if process.env isn't set yet

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. INCREASE PAYLOAD LIMITS: Solves the 413 (Request Entity Too Large) error
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Main Routing mount
app.use("/api/auth", authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth/admin', branchAdminRoutes);

// PAKKA ROUTING SEPARATION FIX
app.use('/api/branch-stock', stockRoutes);
app.use('/api/stock-requests', requeststockRoutes);
app.use('/api/seller', sellerRoutes);

// Root path test
app.get("/", (req, res) => {
  res.send("Server running cleanly.");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server executing live on port: ${PORT}`);
});