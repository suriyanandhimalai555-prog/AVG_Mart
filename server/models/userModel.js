import { pool } from "../config/db.js";

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