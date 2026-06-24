import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from './routes/productRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Adjust this matching your client port exactly
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Main Routing mount
app.use("/api/auth", authRoutes);
app.use('/api/products', productRoutes);

// Root path test
app.get("/", (req, res) => {
  res.send("Server running cleanly.");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server executing live on port: ${PORT}`);
});