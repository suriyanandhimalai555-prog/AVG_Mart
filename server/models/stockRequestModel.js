import { pool } from '../config/db.js';

export const StockRequestModel = {
  // Capture and insert the adminId into the database column safely
  create: async ({ productId, category, requestedCount, totalAmount, adminId }) => {
    const query = `
      INSERT INTO stock_requests (product_id, category, requested_count, total_amount, admin_id, status)
      VALUES ($1, $2, $3, $4, $5, 'Pending')
      RETURNING *;
    `;
    const values = [productId, category, requestedCount, totalAmount, adminId];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // PAKKA FIX: Default properties inside an empty object fallback to completely protect against destructuring failures
  findAll: async ({ adminId = null, role = '' } = {}) => {
    let query;
    let values = [];

    // If master super admin, pull everything across all branches
    if (role === 'admin' || role === 'super_admin') {
      query = `
        SELECT sr.*, p.name as product_name, p.branch_admin_price 
        FROM stock_requests sr
        LEFT JOIN products p ON sr.product_id = p.id
        ORDER BY sr.id DESC; 
      `; // 👈 Swapped sr.created_at to sr.id to eliminate column naming dependency bugs
    } else {
      // If branch admin, strictly bind the output to their active administrative row identity
      query = `
        SELECT sr.*, p.name as product_name, p.branch_admin_price 
        FROM stock_requests sr
        LEFT JOIN products p ON sr.product_id = p.id
        WHERE sr.admin_id = $1
        ORDER BY sr.id DESC;
      `;
      values = [adminId];
    }

    const { rows } = await pool.query(query, values);
    return rows;
  },

  updateStatus: async (id, status) => {
    const query = `
      UPDATE stock_requests 
      SET status = $1 
      WHERE id = $2 
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [status, id]);
    return rows[0];
  }
};