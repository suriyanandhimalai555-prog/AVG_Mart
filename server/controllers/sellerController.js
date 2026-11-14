import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import Seller from '../models/sellerModel.js';
import { s3Client, BUCKET_NAME } from '../config/s3.js';
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { pool } from '../config/db.js';

// Configure Nodemailer with Elastic Email SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.elasticemail.com',
  port: 465,
  secure: true, // SSL required for port 465
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});

// Helper function to generate unique AVGMART + 6-digit referral code
const generateReferralCode = async () => {
  let isUnique = false;
  let referralCode = '';

  while (!isUnique) {
    const randomSixDigits = Math.floor(100000 + Math.random() * 900000);
    referralCode = `AVGMART${randomSixDigits}`;

    const existing = await pool.query('SELECT id FROM sellers WHERE referral_code = $1', [referralCode]);
    if (existing.rows.length === 0) {
      isUnique = true;
    }
  }
  return referralCode;
};

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

    if (pan_number) {
      const existingPan = await pool.query('SELECT id FROM sellers WHERE UPPER(pan_number) = UPPER($1)', [pan_number.trim()]);
      if (existingPan.rows.length > 0) {
        return res.status(400).json({ message: "An account with this PAN number is already registered." });
      }
    }

    let gstDocumentUrl = null;

    if (req.file) {
      const fileKey = `sellers/gst-docs/${Date.now()}-${req.file.originalname.replace(/\s+/g, '_')}`;
      
      const uploadParams = {
        Bucket: BUCKET_NAME,
        Key: fileKey,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      await s3Client.send(new PutObjectCommand(uploadParams));
      
      const region = process.env.AWS_REGION || 'us-east-1';
      gstDocumentUrl = `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${fileKey}`;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const generatedReferralCode = await generateReferralCode();

    const newSeller = await Seller.create({
      owner_name, 
      email, 
      password: hashedPassword, 
      phone, 
      gst_number: gst_number ? gst_number.trim() : null, 
      gst_document: gstDocumentUrl,
      pan_number: pan_number.trim(),
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
      referral_code: generatedReferralCode
    });

    if (referral_code && referral_code.trim() !== '') {
      const referrerResult = await pool.query(
        'SELECT id FROM sellers WHERE UPPER(referral_code) = UPPER($1)',
        [referral_code.trim()]
      );

      if (referrerResult.rows.length > 0) {
        const referrerId = referrerResult.rows[0].id;
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
    console.error("Seller Registration Error:", error);
    res.status(500).json({ message: error.message || "Server error during registration." });
  }
};

export const getSellerReferralTree = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const directQuery = await pool.query(
      `SELECT s.id, s.store_name, s.owner_name, s.email, s.phone, s.created_at, s.referral_code
       FROM seller_referrals r
       JOIN sellers s ON r.referred_id = s.id
       WHERE r.referrer_id = $1
       ORDER BY r.created_at DESC`,
      [sellerId]
    );

    res.status(200).json({
      success: true,
      totalDirect: directQuery.rows.length,
      referrals: directQuery.rows
    });
  } catch (error) {
    console.error("Direct Referrals Error:", error);
    res.status(500).json({ success: false, message: error.message });
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

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const seller = await Seller.findByEmail(email);
    
    if (!seller) {
      return res.status(404).json({ message: "No seller account found with this email address." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query(
      `UPDATE sellers SET reset_otp = $1, otp_expiry = $2 WHERE id = $3`,
      [otp, otpExpiry, seller.id]
    );

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
          <p style="font-size: 12px; color: #777; text-align: center;">This OTP is valid for 10 minutes.</p>
        </div>
      `,
    });

    res.status(200).json({ success: true, message: "6-digit OTP sent successfully to your email." });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: error.message || "Failed to send OTP email." });
  }
};

export const resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const seller = await Seller.findByEmail(email);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found." });
    }

    if (seller.reset_otp !== otp || new Date() > new Date(seller.otp_expiry)) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

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
    const sellerId = req.user.id;

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
        totalReferrals: totalReferrals
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
    const { date, startDate, endDate } = req.query;
    const sellers = await Seller.findAll();

    const enrichedSellers = await Promise.all(
      sellers.map(async (seller) => {
        let periodEarnings = 0;
        let dailySales = [];

        try {
          let dateFilterQuery = '';
          let queryParams = [String(seller.id)];

          // If a specific single date is queried (for daily 12AM-11:59PM payout generation)
          if (date) {
            dateFilterQuery = ` AND o.created_at >= $2::timestamp AND o.created_at <= $3::timestamp`;
            queryParams.push(`${date} 00:00:00`, `${date} 23:59:59`);
          } 
          // If a custom range is provided
          else if (startDate && endDate) {
            dateFilterQuery = ` AND o.created_at >= $2::timestamp AND o.created_at <= $3::timestamp`;
            queryParams.push(`${startDate} 00:00:00`, `${endDate} 23:59:59`);
          } else {
            // Default to today's date if no filter is passed, so the dashboard shows today's 12AM-11:59PM payout by default
            const todayStr = new Date().toISOString().split('T')[0];
            dateFilterQuery = ` AND o.created_at >= $2::timestamp AND o.created_at <= $3::timestamp`;
            queryParams.push(`${todayStr} 00:00:00`, `${todayStr} 23:59:59`);
          }

          // Calculate earnings strictly within the 12:00 AM - 11:59 PM window
          const earningsQuery = await pool.query(
            `SELECT COALESCE(SUM(COALESCE(oi.price, p.offer_price, p.original_price, 0) * oi.quantity), 0) AS period_earned
             FROM order_items oi
             JOIN orders o ON oi.order_id::text = o.id::text
             JOIN products p ON oi.product_id::text = p.id::text
             WHERE p.seller_id::text = $1::text ${dateFilterQuery}`,
            queryParams
          );

          if (earningsQuery.rows.length > 0) {
            periodEarnings = Number(earningsQuery.rows[0].period_earned);
          }

          // Daily breakdown
          const dailyQuery = await pool.query(
            `SELECT DATE(o.created_at) AS sale_date,
                    COALESCE(SUM(COALESCE(oi.price, p.offer_price, p.original_price, 0) * oi.quantity), 0) AS daily_amount,
                    COUNT(DISTINCT o.id) AS order_count
             FROM orders o
             JOIN order_items oi ON o.id::text = oi.order_id::text
             JOIN products p ON oi.product_id::text = p.id::text
             WHERE p.seller_id::text = $1::text
             GROUP BY DATE(o.created_at)
             ORDER BY sale_date DESC
             LIMIT 30`,
            [String(seller.id)]
          );

          dailySales = dailyQuery.rows.map(row => ({
            date: row.sale_date,
            amount: Number(row.daily_amount),
            orders: Number(row.order_count)
          }));

        } catch (err) {
          console.log(`Earnings calculation notice for seller ${seller.id}:`, err.message);
        }

        return {
          ...seller,
          total_earnings: periodEarnings, // Represents the specific daily/period payout window amount
          daily_sales: dailySales
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: enrichedSellers.length,
      sellers: enrichedSellers
    });
  } catch (error) {
    console.error("Error in getAllSellers:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to retrieve sellers from database." 
    });
  }
};

// Update payout status for a seller on a specific date
export const updateSellerPayoutStatus = async (req, res) => {
  try {
    const { sellerId, date, status } = req.body; // status: 'pending' or 'paid'

    // You can store this in a dedicated daily_payouts table or update a JSON/status log
    // Example using a daily_payout_logs table:
    await pool.query(
      `INSERT INTO daily_payout_logs (seller_id, payout_date, status)
       VALUES ($1, $2, $3)
       ON CONFLICT (seller_id, payout_date)
       DO UPDATE SET status = $3, updated_at = NOW()`,
      [sellerId, date, status]
    );

    res.status(200).json({ success: true, message: "Payout status updated successfully!" });
  } catch (error) {
    console.error("Error updating payout status:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch payout history specifically for logged-in seller view
export const getSellerMyPayouts = async (req, res) => {
  try {
    const sellerId = req.user.id;

    // Fetch daily earnings breakdown along with payout status from logs
    const payoutsQuery = await pool.query(
      `SELECT DATE(o.created_at) AS payout_date,
              COALESCE(SUM(COALESCE(oi.price, p.offer_price, p.original_price, 0) * oi.quantity), 0) AS earned_amount,
              COUNT(DISTINCT o.id) AS total_orders,
              COALESCE(l.status, 'pending') AS payout_status
       FROM orders o
       JOIN order_items oi ON o.id::text = oi.order_id::text
       JOIN products p ON oi.product_id::text = p.id::text
       LEFT JOIN daily_payout_logs l ON l.seller_id = p.seller_id AND l.payout_date = DATE(o.created_at)
       WHERE p.seller_id::text = $1::text
       GROUP BY DATE(o.created_at), l.status
       ORDER BY payout_date DESC`,
      [String(sellerId)]
    );

    res.status(200).json({
      success: true,
      payouts: payoutsQuery.rows
    });
  } catch (error) {
    console.error("Error fetching seller payouts:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};