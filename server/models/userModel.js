import { pool } from "../config/db.js";

// --- USER OPERATIONS ---
export const createUserModel = async (name, email, password, role = "user") => {
  const query = `
    INSERT INTO users (name, email, password, role) 
    VALUES ($1, $2, $3, $4) 
    RETURNING id, name, email, role, created_at;
  `;
  const values = [name, email, password, role];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const findUserByEmailModel = async (email) => {
  const query = "SELECT * FROM users WHERE email = $1;";
  const { rows } = await pool.query(query, [email]);
  return rows[0];
};

export const findUserByIdModel = async (id) => {
  const query = "SELECT id, name, email, role FROM users WHERE id = $1;";
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

export const updatePasswordModel = async (id, hashedPassword) => {
  const query = "UPDATE users SET password = $1 WHERE id = $2;";
  await pool.query(query, [hashedPassword, id]);
};


// --- ADDRESS CRUD OPERATIONS ---
export const getAddressesByUserId = async (userId) => {
  const query = "SELECT * FROM addresses WHERE user_id = $1 ORDER BY created_at DESC;";
  const { rows } = await pool.query(query, [userId]);
  return rows;
};

export const createAddressModel = async (userId, data) => {
  const query = `
    INSERT INTO addresses (user_id, tag, phone, street_name, landmark, city, state, district, pincode)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
  `;
  const values = [userId, data.tag, data.phone, data.streetName, data.landmark, data.city, data.state, data.district, data.pincode];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const updateAddressModel = async (addressId, userId, data) => {
  const query = `
    UPDATE addresses 
    SET tag = $1, phone = $2, street_name = $3, landmark = $4, city = $5, state = $6, district = $7, pincode = $8
    WHERE id = $9 AND user_id = $10
    RETURNING *;
  `;
  const values = [data.tag, data.phone, data.streetName, data.landmark, data.city, data.state, data.district, data.pincode, addressId, userId];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const deleteAddressModel = async (addressId, userId) => {
  const query = "DELETE FROM addresses WHERE id = $1 AND user_id = $2 RETURNING id;";
  const { rows } = await pool.query(query, [addressId, userId]);
  return rows.length > 0;
};