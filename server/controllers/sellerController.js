import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import Seller from '../models/sellerModel.js';
import {pool} from '../config/db.js';

// Configure Nodemailer with Elastic Email SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.elasticemail.com',
  port: 465,
  secure: true, // SSL required for port 465
  auth: {
    user: process.env.EMAIL_USER, // e.g., your Elastic Email username/email
    pass: process.env.EMAIL_PASS  // Elastic Email API Key or SMTP Password
  }
});

// 1. Register Seller
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
      account_number,
      referral_code
    } = req.body;

    const existingSeller = await Seller.findByEmail(email);
    if (existingSeller) {
      return res.status(400).json({ message: "Seller account already exists with this email." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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
      account_number,
      referral_code
    });

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

// 2. Login Seller
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
        sellerId: seller.id,
        name: seller.store_name,
        email: seller.email,
        role: 'seller'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Request Password Reset OTP via Elastic Email
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const seller = await Seller.findByEmail(email);
    
    if (!seller) {
      return res.status(404).json({ message: "No seller account found with this email address." });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // Valid for 10 minutes

    // Directly update OTP and expiry in PostgreSQL database
    await pool.query(
      `UPDATE sellers SET reset_otp = $1, otp_expiry = $2 WHERE id = $3`,
      [otp, otpExpiry, seller.id]
    );

    // Send Email via Elastic Email SMTP
    await transporter.sendMail({
      from: `"AVG MART Support" <${process.env.EMAIL_USER}>`,
      to: seller.email,
      subject: "Password Reset OTP - AVG MART Seller Portal",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 500px; margin: auto; border: 1px solid #eee; border-radius: 12px;">
          <h2 style="color: #0A224E; text-align: center;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>You requested to reset your password for your AVG MART Seller account. Use the 6-digit OTP below to proceed:</p>
          <div style="background: #f4f4f4; padding: 15px; font-size: 26px; font-weight: bold; letter-spacing: 6px; text-align: center; color: #A5CE00; border-radius: 8px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="font-size: 12px; color: #777; text-align: center;">This OTP is valid for 10 minutes. If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });

    res.status(200).json({ success: true, message: "6-digit OTP sent successfully to your email." });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: error.message || "Failed to send OTP email." });
  }
};

// 4. Verify OTP & Reset Password
export const resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const seller = await Seller.findByEmail(email);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found." });
    }

    // Check if OTP matches and is not expired
    if (seller.reset_otp !== otp || new Date() > new Date(seller.otp_expiry)) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Directly update password and clear OTP fields in PostgreSQL database
    await pool.query(
      `UPDATE sellers SET password = $1, reset_otp = NULL, otp_expiry = NULL WHERE id = $2`,
      [hashedPassword, seller.id]
    );

    res.status(200).json({ success: true, message: "Password reset successfully! You can now log in." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: error.message || "Failed to reset password." });
  }
};

// Add this new function to sellerController.js

export const verifySellerOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const seller = await Seller.findByEmail(email);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found." });
    }

    if (!seller.reset_otp || seller.reset_otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP. Please check your email." });
    }

    if (new Date() > new Date(seller.otp_expiry)) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    res.status(200).json({ success: true, message: "OTP verified successfully!" });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ message: error.message || "Failed to verify OTP." });
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

export const getSellerProfile = async (req, res) => {
  try {
    const sellerId = req.user.id;
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

export const getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.findAll();

    return res.status(200).json({
      success: true,
      count: sellers.length,
      sellers
    });
  } catch (error) {
    console.error("Error in getAllSellers:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to retrieve sellers from database." 
    });
  }
};