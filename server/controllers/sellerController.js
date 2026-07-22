import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Seller from '../models/sellerModel.js';

export const registerSeller = async (req, res) => {
  try {
    const {
      owner_name,
      email,
      password,
      phone,
      gst_number,
      pan_number,
      store_name,
      store_description,
      pickup_address,
      city,
      state,
      pincode,
      shipping_type,
      account_holder,
      bank_name,
      ifsc_code,
      account_number
    } = req.body;

    // Check existing email
    const existingSeller = await Seller.findByEmail(email);
    if (existingSeller) {
      return res.status(400).json({ message: "Seller account already exists with this email." });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save seller with complete details
    const newSeller = await Seller.create({
      owner_name,
      email,
      password: hashedPassword,
      phone,
      gst_number,
      pan_number,
      store_name,
      store_description,
      pickup_address,
      city,
      state,
      pincode,
      shipping_type,
      account_holder,
      bank_name,
      ifsc_code,
      account_number
    });

    // JWT Token creation
    const token = jwt.sign(
      { id: newSeller.id, role: 'seller' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: "Merchant Account Created & Saved Successfully!",
      token,
      user: { ...newSeller, role: 'seller' }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;

    const seller = await Seller.findByEmail(email);
    if (!seller) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: seller.id, role: 'seller' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: seller.id,
        name: seller.store_name,
        email: seller.email,
        role: 'seller'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSellerDashboardData = async (req, res) => {
  try {
    res.status(200).json({
      stats: {
        totalSales: "₹1,48,920",
        totalOrders: 342,
        activeProducts: 48,
        pendingShipments: 12
      },
      recentOrders: [
        { id: "ORD-9910", customer: "Rahul Sharma", product: "Wireless Earbuds", amount: "₹1,299", status: "Processing" },
        { id: "ORD-9909", customer: "Priya Nair", product: "Smart Watch V2", amount: "₹3,499", status: "Shipped" },
        { id: "ORD-9908", customer: "Ankit Verma", product: "Gaming Mouse", amount: "₹899", status: "Delivered" },
      ]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Seller Profile details
export const getSellerProfile = async (req, res) => {
  try {
    const sellerId = req.user.id; // Extracted from JWT verification middleware
    const seller = await Seller.findById(sellerId);

    if (!seller) {
      return res.status(404).json({ message: "Seller profile not found." });
    }

    res.status(200).json({
      success: true,
      seller
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};