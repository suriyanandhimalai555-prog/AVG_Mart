import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import branchAdminRoutes from './routes/branchAdminRoutes.js';
import stockRoutes from './routes/stockRoutes.js';             
import requeststockRoutes from './routes/requestStockRoutes.js'; 
import sellerRoutes from './routes/sellerRoutes.js';
import marketerRoutes from './routes/marketerRoutes.js';
import appSettingRoutes from './routes/appSettingRoutes.js';

dotenv.config();

const app = express();

// Security HTTP headers
app.use(helmet());

// 1. CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL, 
  'https://avgmart.com',
  'https://www.avgmart.com',
  'http://localhost:5173'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow non-browser requests (Postman, curl, mobile apps)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS policy denial: Origin not allowed'), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));


// 2. Body Parser Limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 3. API Routes
app.use("/api/auth", authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth/admin', branchAdminRoutes);
app.use('/api/branch-stock', stockRoutes);
app.use('/api/stock-requests', requeststockRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/marketer', marketerRoutes);
app.use('/api/settings', appSettingRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server running cleanly." });
});

// 4. Global Error Handling Middleware (MUST be at the very bottom)
app.use((err, req, res, next) => {
  console.error(`[Error Handler]: ${err.stack || err.message}`);
  
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server executing live on port: ${PORT}`);
});