import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import client from "prom-client";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import branchAdminRoutes from './routes/branchAdminRoutes.js';
import stockRoutes from './routes/stockRoutes.js';
import requeststockRoutes from './routes/requestStockRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';
import marketerRoutes from './routes/marketerRoutes.js';
import appSettingRoutes from './routes/appSettingRoutes.js';
import appBannerRoutes from './routes/appBannerRoutes.js';


const app = express();

client.collectDefaultMetrics();

const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total HTTP Requests",
  labelNames: ["method", "route", "status"]
});

app.use((req, res, next) => {
  res.on("finish", () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode
    });
  });

  next();
});

// Security HTTP headers
app.use(
  helmet({
    crossOriginOpenerPolicy: {
      policy: "same-origin-allow-popups",
    },
  })
);
// 1. CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://avgmart.com',
  'https://www.avgmart.com',
  'http://localhost:5173'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {

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
app.use('/api/banners', appBannerRoutes);

// Kubernetes Health Check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    service: "AVG Mart Backend"
  });
});

// Prometheus Metrics Endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server running cleanly."
  });
});

// Global Error Handling Middleware
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
