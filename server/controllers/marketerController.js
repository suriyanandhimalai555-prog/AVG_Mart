import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Helper to generate a unique referral code
const generateReferralCode = (name) => {
  const prefix = name.replace(/[^a-zA-Z]/g, '').substring(0, 4).toUpperCase();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${randomNum}`;
};

// MARKETER REGISTER
export const registerMarketer = async (req, res) => {
  const { name, city, phone, email, password } = req.body;

  try {
    if (!name || !city || !phone || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if marketer exists
    const existing = await pool.query(
      'SELECT id FROM marketers WHERE email = $1 OR phone = $2',
      [email, phone]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Email or Phone already registered.' });
    }

    // Generate Unique Referral Code
    let referralCode;
    let isUnique = false;
    while (!isUnique) {
      referralCode = generateReferralCode(name);
      const checkCode = await pool.query(
        'SELECT id FROM marketers WHERE referral_code = $1',
        [referralCode]
      );
      if (checkCode.rows.length === 0) isUnique = true;
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert Marketer
    const newMarketer = await pool.query(
      `INSERT INTO marketers (name, city, phone, email, password, referral_code) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, name, email, phone, city, referral_code`,
      [name, city, phone, email, hashedPassword, referralCode]
    );

    return res.status(201).json({
      message: 'Registration successful',
      marketer: newMarketer.rows[0]
    });
  } catch (err) {
    console.error('Registration Error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// MARKETER LOGIN
export const loginMarketer = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const result = await pool.query('SELECT * FROM marketers WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const marketer = result.rows[0];
    const isMatch = await bcrypt.compare(password, marketer.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT Token with marketing role
    const token = jwt.sign(
      { id: marketer.id, role: 'marketer' },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '7d' }
    );

    delete marketer.password; // Exclude password from response

    return res.status(200).json({
      token,
      marketer
    });
  } catch (err) {
    console.error('Login Error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// GET MARKETER PROFILE / DASHBOARD DATA
export const getMarketerProfile = async (req, res) => {
  try {
    const marketer = await pool.query(
      'SELECT id, name, city, phone, email, referral_code, created_at FROM marketers WHERE id = $1',
      [req.user.id]
    );

    if (marketer.rows.length === 0) {
      return res.status(404).json({ message: 'Marketer not found' });
    }

    return res.status(200).json(marketer.rows[0]);
  } catch (err) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get Profile & Referred Sellers for the logged-in marketer
export const getMarketerDashboard = async (req, res) => {
  try {
    const marketerId = req.user.id;

    // 1. Get Marketer Profile from DB
    const marketerRes = await pool.query(
      'SELECT id, name, email, phone, city, referral_code FROM marketers WHERE id = $1',
      [marketerId]
    );

    if (marketerRes.rows.length === 0) {
      return res.status(404).json({ message: "Marketer profile not found." });
    }

    const marketer = marketerRes.rows[0];

    // 2. Fetch all sellers registered using this marketer's referral code
    const referredSellersQuery = `
      SELECT 
        id, owner_name, email, phone, store_name, city, state, created_at, status 
      FROM sellers 
      WHERE UPPER(referral_code) = UPPER($1)
      ORDER BY created_at DESC
    `;
    
    const { rows: referredSellers } = await pool.query(referredSellersQuery, [marketer.referral_code]);

    res.status(200).json({
      success: true,
      marketer,
      referredSellers,
      totalReferred: referredSellers.length
    });
  } catch (error) {
    console.error("Error fetching marketer dashboard data:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};