import { pool } from '../config/db.js';

const Seller = {
  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS sellers (
        id SERIAL PRIMARY KEY,
        owner_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        gst_number VARCHAR(50) NOT NULL,
        pan_number VARCHAR(50),
        store_name VARCHAR(255) NOT NULL,
        store_description TEXT,
        pickup_address TEXT NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        pincode VARCHAR(20) NOT NULL,
        shipping_type VARCHAR(50) DEFAULT 'standard',
        account_holder VARCHAR(255) NOT NULL,
        bank_name VARCHAR(255) NOT NULL,
        ifsc_code VARCHAR(50) NOT NULL,
        account_number VARCHAR(100) NOT NULL,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    return await pool.query(query);
  },

  findByEmail: async (email) => {
    const res = await pool.query('SELECT * FROM sellers WHERE email = $1', [email]);
    return res.rows[0];
  },

  findById: async (id) => {
    const res = await pool.query(
      `SELECT 
        id, owner_name, email, phone, gst_number, pan_number, 
        store_name, store_description, pickup_address, city, state, 
        pincode, shipping_type, account_holder, bank_name, ifsc_code, status 
       FROM sellers WHERE id = $1`,
      [id]
    );
    return res.rows[0];
  },

  create: async (data) => {
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
    } = data;

    const res = await pool.query(
      `INSERT INTO sellers (
        owner_name, email, password, phone, gst_number, pan_number,
        store_name, store_description, pickup_address, city, state,
        pincode, shipping_type, account_holder, bank_name, ifsc_code, account_number
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING id, store_name, owner_name, email, status`,
      [
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
      ]
    );
    return res.rows[0];
  }
};

export default Seller;