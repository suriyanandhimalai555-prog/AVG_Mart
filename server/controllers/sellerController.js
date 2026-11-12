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

// Helper function to generate unique AVGMART + 6-digit referral code
const generateReferralCode = async () => {
  let isUnique = false;
  let referralCode = '';

  while (!isUnique) {
    const randomSixDigits = Math.floor(100000 + Math.random() * 900000);
    referralCode = `AVGMART${randomSixDigits}`;

    // Check if code already exists in database
    const existing = await pool.query('SELECT id FROM sellers WHERE referral_code = $1', [referralCode]);
    if (existing.rows.length === 0) {
      isUnique = true;
    }
  }
  return referralCode;
};

// Inside registerSeller (update where newSeller is created):
export const registerSeller = async (req, res) => {
  try {
    const {
      owner_name, email, password, phone, gst_number, pan_number,
      store_name, store_description, pickup_address, city, state,
      pincode, shipping_type, account_holder, bank_name, ifsc_code,
      account_number, referral_code
    } = req.body;

    const existingSeller = await Seller.findByEmail(email);
    if (existingSeller) {
      return res.status(400).json({ message: "Seller account already exists with this email." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const generatedReferralCode = await generateReferralCode();

    const newSeller = await Seller.create({
      owner_name, email, password: hashedPassword, phone, gst_number, pan_number,
      store_name, store_description, pickup_address, city, state, pincode,
      shipping_type, account_holder, bank_name, ifsc_code, account_number,
      referral_code: generatedReferralCode
    });

    // IF A REFERRAL CODE WAS PROVIDED, LINK THEM IN THE TREE
    if (referral_code && referral_code.trim() !== '') {
      const referrerResult = await pool.query(
        'SELECT id FROM sellers WHERE UPPER(referral_code) = UPPER($1)',
        [referral_code.trim()]
      );

      if (referrerResult.rows.length > 0) {
        const referrerId = referrerResult.rows[0].id;
        // Prevent self-referral
        if (referrerId !== newSeller.id) {
          await pool.query(
            'INSERT INTO seller_referrals (referrer_id, referred_id) VALUES ($1, $2)',
            [referrerId, newSeller.id]
          );
        }
      }
    }

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

// ADD THIS NEW CONTROLLER TO GET REFERRED SELLERS (TREE STRUCTURE)
export const getSellerReferralTree = async (req, res) => {
  try {
    const sellerId = req.user.id;

    // Fetch direct referrals (Level 1)
    const directQuery = await pool.query(
      `SELECT s.id, s.store_name, s.owner_name, s.email, s.phone, s.created_at, s.referral_code
       FROM seller_referrals r
       JOIN sellers s ON r.referred_id = s.id
       WHERE r.referrer_id = $1
       ORDER BY r.created_at DESC`,
      [sellerId]
    );

    const directReferrals = directQuery.rows;

    // Optional: Fetch Level 2 referrals (referrals of your referrals)
    const referralTree = [];
    for (let direct of directReferrals) {
      const subQuery = await pool.query(
        `SELECT s.id, s.store_name, s.owner_name, s.email, s.phone, s.created_at, s.referral_code
         FROM seller_referrals r
         JOIN sellers s ON r.referred_id = s.id
         WHERE r.referrer_id = $1
         ORDER BY r.created_at DESC`,
        [direct.id]
      );
      referralTree.push({
        ...direct,
        subReferrals: subQuery.rows
      });
    }

    res.status(200).json({
      success: true,
      totalDirect: directReferrals.length,
      referrals: referralTree
    });
  } catch (error) {
    console.error("Referral Tree Error:", error);
    res.status(500).json({ success: false, message: error.message });
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
    const sellerId = req.user.id; // From auth middleware

    // 1. Fetch products created by this seller with ordered count
    const productsResult = await pool.query(
      `SELECT 
         p.id, 
         p.name, 
         p.category, 
         p.original_price, 
         p.offer_price, 
         p.count, 
         p.images, 
         p.is_featured, 
         p.is_approved,
         COALESCE(SUM(oi.quantity), 0) AS ordered_count
       FROM products p
       LEFT JOIN order_items oi ON p.id::text = oi.product_id::text
       WHERE p.seller_id::text = $1::text
       GROUP BY p.id, p.name, p.category, p.original_price, p.offer_price, p.count, p.images, p.is_featured, p.is_approved
       ORDER BY p.id DESC`,
      [String(sellerId)]
    );

    const products = productsResult.rows;
    const activeProducts = products.length;

    // 2. Fetch total referrals count for this seller
    let totalReferrals = 0;
    try {
      const referralResult = await pool.query(
        `SELECT COUNT(*) AS count FROM seller_referrals WHERE referrer_id = $1`,
        [sellerId]
      );
      if (referralResult.rows.length > 0) {
        totalReferrals = Number(referralResult.rows[0].count);
      }
    } catch (refErr) {
      console.log("Referral count query notice:", refErr.message);
    }

    // 3. Fetch order stats by joining orders, order_items, and products safely
    let totalSales = 0;
    let totalOrders = 0;
    let pendingShipments = 0;
    let recentOrders = [];

    try {
      const statsResult = await pool.query(
        `SELECT 
           COALESCE(SUM(COALESCE(o.total_price, 0)), 0) AS total_sales,
           COUNT(DISTINCT o.id) AS total_orders,
           COUNT(DISTINCT o.id) FILTER (WHERE LOWER(o.status) IN ('pending', 'processing', 'preparing')) AS pending_shipments
         FROM orders o
         JOIN order_items oi ON o.id::text = oi.order_id::text
         JOIN products p ON oi.product_id::text = p.id::text
         WHERE p.seller_id::text = $1::text`,
        [String(sellerId)]
      );

      if (statsResult.rows.length > 0) {
        totalSales = statsResult.rows[0].total_sales;
        totalOrders = statsResult.rows[0].total_orders;
        pendingShipments = statsResult.rows[0].pending_shipments;
      }

      const recentOrdersResult = await pool.query(
        `SELECT DISTINCT o.id, 
                COALESCE(u.name, 'Customer') AS customer_name, 
                COALESCE(o.total_price, 0) AS amount, 
                o.status, 
                p.name AS product_name
         FROM orders o
         LEFT JOIN users u ON o.user_id::text = u.id::text
         JOIN order_items oi ON o.id::text = oi.order_id::text
         JOIN products p ON oi.product_id::text = p.id::text
         WHERE p.seller_id::text = $1::text
         ORDER BY o.id DESC 
         LIMIT 5`,
        [String(sellerId)]
      );

      recentOrders = recentOrdersResult.rows.map(order => ({
        id: String(order.id).startsWith('ORD-') ? order.id : `ORD-${order.id}`,
        customer: order.customer_name,
        product: order.product_name,
        amount: `₹${Number(order.amount).toLocaleString('en-IN')}`,
        status: order.status || 'Processing'
      }));
    } catch (orderErr) {
      console.log("Orders query notice:", orderErr.message);
    }

    res.status(200).json({
      success: true,
      stats: {
        totalSales: `₹${Number(totalSales).toLocaleString('en-IN')}`,
        totalOrders: Number(totalOrders),
        activeProducts: activeProducts,
        pendingShipments: Number(pendingShipments),
        totalReferrals: totalReferrals // <--- Added referral count here
      },
      recentOrders: recentOrders,
      products: products.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        originalPrice: item.original_price,
        offerPrice: item.offer_price,
        count: item.count,
        images: item.images,
        isFeatured: item.is_featured,
        isApproved: item.is_approved,
        orderedCount: Number(item.ordered_count || 0)
      }))
    });
  } catch (error) {
    console.error("Error fetching seller dashboard data:", error);
    res.status(500).json({ success: false, message: error.message });
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